// src/seedRoles.js
import Role from "./models/Role.js";

const DEFAULT_ROLES = [
  {
    role: "customer",
    definition: "Buys products/services for own use or for end-use deployment.",
  },
  {
    role: "distributor",
    definition:
      "Purchases products primarily to resell downstream to wholesalers/retailers.",
  },
  {
    role: "partner",
    definition:
      "Collaborates in business alliance or joint activity; may co-sell, integrate, or co-market.",
  },
  {
    role: "service_agent",
    definition:
      "Provides services around the product (installation, maintenance, field service, support).",
  },
  {
    role: "unknown",
    definition: "Insufficient or conflicting evidence to infer a role.",
  },
];

export async function ensureRolesSeeded() {
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      await Role.insertMany(DEFAULT_ROLES);
      console.log("Seeded default roles");
    } else {
      for (const r of DEFAULT_ROLES) {
        await Role.updateOne({ role: r.role }, { $set: r }, { upsert: true });
      }
      console.log("Role definitions verified");
    }
  } catch (error) {
    console.error("Seeding failed:", error.message);
  }
}
