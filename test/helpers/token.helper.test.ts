import tokenHelper from "../../src/helper/token.helper";
import jwt from "jsonwebtoken";

describe("get audiences", () => {
  //Arrange
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  let expectedAudience = "localhost:3000";
  process.env.AUDIENCE = "localhost:3000";

  //Act & Assert
  test("returns atleast one audience", () => {
    let audience = tokenHelper.getAudience();
    expect(audience?.length).toBe(1);
  });

  test("audience should not be null", () => {
    expect(tokenHelper.getAudience()).toBeDefined();
  });

  test("audience should match expected audience", () => {
    let audience = tokenHelper.getAudience();
    let singleAudience = audience != undefined ? audience[0] : "";
    expect(singleAudience).toBe(expectedAudience);
  });

  test("should throw error when audience configuration is not defined", () => {
    process.env.AUDIENCE = undefined;
    expect(() => {
      tokenHelper.getAudience();
    }).toThrowError("Missing Configuration");
  });
});

describe("decode token", () => {
  //Arrange
  const expectedEmail = "some@email.com";

  const verify = jest.spyOn(jwt, "decode");
  verify.mockImplementation(() => () => ({ email: expectedEmail }));
  let req = {
    headers: {
      authorization:
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxva2lAcHJpc21hLmlvIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJpYXQiOjE2NTUyODI3OTEsImV4cCI6MTY1NTI4NjM5MX0.yNrMRJZPZ8dRPDD5v2T42H846dVKgOfhkkTxMbFr7Gc",
    },
  };

  //Act & Assert
  test("email claim should match decoded jwt", async () => {
    await tokenHelper.decodeToken(req).then((result: any) => {
      let { email } = result();
      expect(email).toBe(expectedEmail);
    });
  });

  test("throw error when passed null token", async () => {
    req = {
      headers: {
        authorization: "bearer",
      },
    };

    await tokenHelper.decodeToken(req).catch((error) => {
      expect(error.name).toBe("UnauthorizedError");
    });
  });
});
