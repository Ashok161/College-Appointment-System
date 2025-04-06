const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

describe("E2E Workflow", () => {
  let studentA1Token, studentA2Token, professorP1Token;
  let availabilityIdT1, availabilityIdT2, appointmentIdA1;
  let professorP1Id;

  beforeAll(async () => {});

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Complete appointment booking and cancellation flow", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Student A1",
      email: "a1@test.com",
      password: "password",
      role: "student",
    });
    await request(app).post("/api/auth/register").send({
      name: "Professor P1",
      email: "p1@test.com",
      password: "password",
      role: "professor",
    });
    const loginP1 = await request(app)
      .post("/api/auth/login")
      .send({ email: "p1@test.com", password: "password" });
    professorP1Token = loginP1.body.token;
    professorP1Id = loginP1.body.userId;
    const loginA1 = await request(app)
      .post("/api/auth/login")
      .send({ email: "a1@test.com", password: "password" });
    studentA1Token = loginA1.body.token;

    const now = new Date();
    const T1Start = new Date(now.getTime() + 3600000).toISOString();
    const T1End = new Date(now.getTime() + 5400000).toISOString();
    const T2Start = new Date(now.getTime() + 7200000).toISOString();
    const T2End = new Date(now.getTime() + 9000000).toISOString();

    const availRes = await request(app)
      .post("/api/availability")
      .set("Authorization", `Bearer ${professorP1Token}`)
      .send({
        availabilities: [
          { startTime: T1Start, endTime: T1End },
          { startTime: T2Start, endTime: T2End },
        ],
      });
    expect(availRes.status).toBe(201);

    const availabilitiesRes = await request(app)
      .get(`/api/availability/${professorP1Id}`)
      .set("Authorization", `Bearer ${studentA1Token}`);
    expect(availabilitiesRes.status).toBe(200);
    const availabilities = availabilitiesRes.body;
    const slotT1 = availabilities.find(
      (slot) => new Date(slot.startTime).toISOString() === T1Start
    );
    const slotT2 = availabilities.find(
      (slot) => new Date(slot.startTime).toISOString() === T2Start
    );
    expect(slotT1).toBeDefined();
    expect(slotT2).toBeDefined();
    availabilityIdT1 = slotT1._id;
    availabilityIdT2 = slotT2._id;

    const bookA1 = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${studentA1Token}`)
      .send({ availabilityId: availabilityIdT1 });
    expect(bookA1.status).toBe(201);
    appointmentIdA1 = bookA1.body.appointment._id;

    await request(app).post("/api/auth/register").send({
      name: "Student A2",
      email: "a2@test.com",
      password: "password",
      role: "student",
    });
    const loginA2 = await request(app)
      .post("/api/auth/login")
      .send({ email: "a2@test.com", password: "password" });
    studentA2Token = loginA2.body.token;
    const bookA2 = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${studentA2Token}`)
      .send({ availabilityId: availabilityIdT2 });
    expect(bookA2.status).toBe(201);

    const cancelRes = await request(app)
      .delete(`/api/appointments/cancel/${appointmentIdA1}`)
      .set("Authorization", `Bearer ${professorP1Token}`);
    expect(cancelRes.status).toBe(200);

    const getAppointmentsA1 = await request(app)
      .get("/api/appointments")
      .set("Authorization", `Bearer ${studentA1Token}`);
    expect(getAppointmentsA1.status).toBe(200);
    const pending = getAppointmentsA1.body.filter(
      (app) => app.status === "booked"
    );
    expect(pending.length).toBe(0);
  });
});
