import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const initPassport = () => {
  // Función utilizada por la estrategia registerAuth
  const verifyRegistration = async (req, username, password, done) => {
    try {
      const { first_name, last_name, email, gender } = req.body;

      if (!first_name || !last_name || !email || !gender) {
        return done(
          "Se requiere first_name, last_name, email y gender en el body",
          false
        );
      }

      const user = await userModel.findOne({ email: username });

      if (user) return done(null, false);

      const newUser = {
        first_name,
        last_name,
        email,
        gender,
        password: createHash(password),
      };

      const process = await userModel.create(newUser);

      return done(null, process);
    } catch (err) {
      return done(`Error passport local: ${err.message}`);
    }
  };

  // Función utilizada por la estrategia restoreAuth
  const verifyRestoration = async (req, username, password, done) => {
    try {
      if (username.length === 0 || password.length === 0) {
        return done("Se requiere email y pass en el body", false);
      }

      const user = await userModel.findOne({ email: username });

      if (!user) return done(null, false);

      const process = await userModel.findOneAndUpdate(
        { email: username },
        { password: createHash(password) }
      );

      return done(null, process);
    } catch (err) {
      return done(`Error passport local: ${err.message}`);
    }
  };

  const verifyGithub = async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      const user = await userModel.findOne({ email: profile._json.email });

      if (!user) {
        const name_parts = profile._json.name.split("");
        let newUser = {
          first_name: name_parts[0],
          last_name: name_parts[1],
          email: profile._json.email,
          gender: "NA",
          password: " ",
        };

        const process = await userModel.create(newUser);

        return done(null, process);
      } else {
        done(null, user);
      }
    } catch (err) {
      return done(`Error passport Github: ${err.message}`);
    }
  };

  // Creamos estrategia local de autenticación para registro registerAuth
  passport.use(
    "registerAuth",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "pass",
      },
      verifyRegistration
    )
  );

  // Creamos estrategia local de autenticación para restauración de clave restoreAuth
  passport.use(
    "restoreAuth",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "pass",
      },
      verifyRestoration
    )
  );

  // Creamos estrategia para autenticación externa con Github githubAuth

  passport.use(
    "githubAuth",
    new GithubStrategy(
      {
        clientID: "Iv1.1457dda4525b1c7f",
        clientSecret: " 0cb3a05d9ea27a51f18d949b4f22325320eb7259",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      verifyGithub
    )
  );

  //App ID: 811353

  //Client ID: Iv1.1457dda4525b1c7f

  //0cb3a05d9ea27a51f18d949b4f22325320eb7259

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await userModel.findById(id));
    } catch (err) {
      done(err.message);
    }
  });
};

export default initPassport;
