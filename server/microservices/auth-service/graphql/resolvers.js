// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import User from "../models/User.js";
// import { config } from "../config/config.js";

// const resolvers = {
//   // =========================================================
//   // 🧩 FEDERATION ENTITY RESOLVER
//   // =========================================================
//   User: {
//     /**
//      * Federation will call this whenever another service
//      * (like Community) references a User by ID.
//      */
//     __resolveReference: async (userRef) => {
//       try {
//         const user = await User.findById(userRef.id);
//         if (!user) {
//           console.warn("⚠️ User not found for federated reference:", userRef.id);
//           return null;
//         }

//         return {
//           id: user._id.toString(),
//           username: user.username,
//           email: user.email,
//           role: user.role,
//           createdAt: user.createdAt.toISOString(),
//         };
//       } catch (err) {
//         console.error("❌ Error resolving federated User:", err.message);
//         return null;
//       }
//     },
//   },

//   // =========================================================
//   // 📡 QUERIES
//   // =========================================================
//   Query: {
//     users: async () => {
//       const users = await User.find();
//       return users.map((u) => ({
//         id: u._id.toString(),
//         username: u.username,
//         email: u.email,
//         role: u.role,
//         createdAt: u.createdAt.toISOString(),
//       }));
//     },

//     user: async (_, { id }) => {
//       const u = await User.findById(id);
//       if (!u) throw new Error("User not found");
//       return {
//         id: u._id.toString(),
//         username: u.username,
//         email: u.email,
//         role: u.role,
//         createdAt: u.createdAt.toISOString(),
//       };
//     },

//     currentUser: async (_, __, { req }) => {
//       try {
//         const token =
//           req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
//         if (!token) return null;

//         const decoded = jwt.verify(token, config.JWT_SECRET);
//         const user = await User.findOne({ username: decoded.username });
//         if (!user) return null;

//         return {
//           id: user._id.toString(),
//           username: user.username,
//           email: user.email,
//           role: user.role,
//           createdAt: user.createdAt.toISOString(),
//         };
//       } catch (error) {
//         console.error("❌ Token verification failed:", error.message);
//         return null;
//       }
//     },
//   },

//   // =========================================================
//   // 🔐 MUTATIONS
//   // =========================================================
//   Mutation: {
//     login: async (_, { username, password }, { res }) => {
//       const user = await User.findOne({ username });
//       if (!user) throw new Error("User not found");

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) throw new Error("Invalid password");

//       const token = jwt.sign(
//         { username: user.username, role: user.role },
//         config.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax",
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       console.log(`✅ User ${user.username} logged in successfully`);

//       return {
//         id: user._id.toString(),
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         createdAt: user.createdAt.toISOString(),
//         token,
//       };
//     },

//     register: async (_, { username, email, password, role }) => {
//       const existing = await User.findOne({ username });
//       if (existing) throw new Error("Username already exists");

//       const newUser = new User({ username, email, password, role });
//       await newUser.save();

//       console.log(`✅ User registered: ${username}`);

//       return {
//         id: newUser._id.toString(),
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//         createdAt: newUser.createdAt.toISOString(),
//       };
//     },

//     logout: async (_, __, { res }) => {
//       try {
//         res.clearCookie("token", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "Lax",
//         });
//         console.log("✅ User logged out successfully");
//         return true;
//       } catch (err) {
//         console.error("❌ Logout failed:", err.message);
//         return false;
//       }
//     },
//   },
// };

// export default resolvers;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { config } from "../config/config.js";

const resolvers = {
  // =========================================================
  // 🧩 FEDERATION ENTITY RESOLVER
  // =========================================================
  User: {
    __resolveReference: async (userRef) => {
      try {
        const user = await User.findById(userRef.id);
        if (!user) {
          console.warn("⚠️ User not found for federated reference:", userRef.id);
          return null;
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      } catch (err) {
        console.error("❌ Error resolving federated User:", err.message);
        return null;
      }
    },
  },

  // =========================================================
  // 📡 QUERIES
  // =========================================================
  Query: {
    users: async () => {
      const users = await User.find();
      return users.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      }));
    },

    user: async (_, { id }) => {
      const u = await User.findById(id);
      if (!u) throw new Error("User not found");
      return {
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      };
    },

    currentUser: async (_, __, { req }) => {
      try {
        const token =
          req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, config.JWT_SECRET);

        // ⭐⭐⭐ FIX: lookup user by ID instead of username
        const user = await User.findById(decoded.id);
        if (!user) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return null;
      }
    },
  },

  // =========================================================
  // 🔐 MUTATIONS
  // =========================================================
  Mutation: {
    login: async (_, { username, password }, { res }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid password");

      // ⭐⭐⭐ CRITICAL FIX: include ID in JWT payload
      const token = jwt.sign(
        {
          id: user._id.toString(),     // ✅ REQUIRED FOR MICROFRONTENDS + ISSUE SERVICE
          username: user.username,
          role: user.role,
        },
        config.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Send JWT cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log(`✅ User ${user.username} logged in successfully`);

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        token, // return token for frontend if needed
      };
    },

    register: async (_, { username, email, password, role }) => {
      const existing = await User.findOne({ username });
      if (existing) throw new Error("Username already exists");

      const newUser = new User({ username, email, password, role });
      await newUser.save();

      console.log(`✅ User registered: ${username}`);

      return {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt.toISOString(),
      };
    },

    logout: async (_, __, { res }) => {
      try {
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });
        console.log("✅ User logged out successfully");
        return true;
      } catch (err) {
        console.error("❌ Logout failed:", err.message);
        return false;
      }
    },
  },
};

export default resolvers;
