const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const facebookAuth = require('../libraries/auth/facebook');

const User = require('../models/user');

const AbstractController = require('.');

class AuthController extends AbstractController {
  initRouter() {
    passport.use(new LocalStrategy((email, password, done) => {
      User.findOne({
        rejectOnEmpty: true,
        where: {
          email,
        },
      })
        .then((user) => {
          if (user.validatePassword(password)) {
            return done(null, user.toJSON());
          }

          return done(new Error('Invalid password'));
        })
        .catch(error => done(error));
    }));

    passport.use(new JwtStrategy({
      secretOrKey: 'secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, (user, done) => {
      done(null, user);
    }));

    this.router.post('/login', passport.authenticate('local'), this.handleLogin);

    this.router.post('/validateFacebookToken', this.handleFacebookToken);
  }

  handleLogin(request, response) {
    const token = jwt.sign(request.user, 'secret');

    response.json({
      token,
      user: request.user,
    });
  }

  async handleFacebookToken(request, response) {
    const { userToken } = request.body;

    const userData = await facebookAuth.validateToken(userToken);
    const { email } = userData;

    const [user] = await User.findCreateFind({ email });

    request.user = user.toJSON();

    this.handleLogin(request, response);
  }
}

module.exports = AuthController;
