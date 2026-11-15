import { describe, expect, it } from "vitest";

describe("worker", () => { it("has a service identity", () => expect("worker").toContain("-")); });
