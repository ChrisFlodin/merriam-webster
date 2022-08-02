import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createApp } from "../../app";
import { IUser } from "../../types/user";
import { shutDownDb, startDb } from "../../utils/db";
import { UserModel } from "../../models/user";
import * as merriamWebster from "../../services/merriamService";
import { mockFetchWord } from "../../services/mocks/merriamWebster";
import { deleteAllUsers, saveUser } from "../../services/user";
import { JWT_SECRET } from "../../consts";

const app = createApp();

const userId = new mongoose.Types.ObjectId();

const userData: IUser = {
  _id: userId.toString(),
  email: "alba.cross@gmail.com",
  password: "1234",
  tokens: [
    {
      token: jwt.sign({ _id: userId.toString() }, JWT_SECRET),
    },
  ],
};

describe("Merriam webster Routes", () => {
  describe("Route: /fetch-data/?search=value", () => {
    beforeAll(async () => {
      await startDb();
      const user = await new UserModel(userData);
      await saveUser(user);
    });

    afterAll(async () => {
      await deleteAllUsers();
      await shutDownDb();
    });

    describe("given a valid query string", () => {
      it("should return a 200 status code", async () => {
        const fetchWordMock = jest.spyOn(merriamWebster, "fetchWord").mockReturnValue(mockFetchWord());

        const { status } = await request(app)
          .get("/fetch-data/?search=strength")
          .set("Authorization", `Bearer ${userData.tokens![0].token}`);

        expect(fetchWordMock).toHaveBeenCalled();
        expect(status).toBe(200);
      });
    });

    describe("given no query string", () => {
      it("should return a 400 status code", async () => {
        const fetchWordMock = jest.spyOn(merriamWebster, "fetchWord");

        const { status } = await request(app)
          .get("/fetch-data/")
          .set("Authorization", `Bearer ${userData.tokens![0].token}`);

        // .spyOn calls the function once, should not be called in-app
        expect(fetchWordMock).toHaveBeenCalledTimes(1);
        expect(status).toBe(400);
      });
    });

    describe("given the user does not have a JWT", () => {
      it("should return a 401 status code", async () => {
        const { status } = await request(app).get("/fetch-data/?search=strength").expect(401);
      });
    });

    describe("given the user has an invalid JWT", () => {
      it("should return a 401 status code", async () => {
        const { status } = await request(app)
          .get("/fetch-data/?search=strength")
          .set("Authorization", `Bearer 1234`)
          .expect(401);
      });
    });
  });
});