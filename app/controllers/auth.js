const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

const AbstractController = require('.');

class AuthController extends AbstractController {
  initRouter() {
    passport.use(new LocalStrategy((email, password, done) => {
      User.findOne({
        rejectOnEmpty: true,
        where: {
          email,
          password,
        },
      })
        .then(user => done(null, user.toJSON()))
        .catch(error => done(error));
    }));

    passport.use(new JwtStrategy({
      secretOrKey: 'secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, (user, done) => {
      done(null, user);
    }));

    this.router.post('/login', passport.authenticate('local'), this.handleLogin);
  }

  handleLogin(request, response) {
    const token = jwt.sign(request.user, 'secret');

    response.json({
      token,
      user: request.user,
    });
  }
}

module.exports = AuthController;
