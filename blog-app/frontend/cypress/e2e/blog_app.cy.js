/* eslint-disable vitest/expect-expect */
describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Yasen Dimitrov",
      username: "test",
      password: "pass",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("");
  });

  it("login form is shown", function () {
    cy.contains("log in");
  });

  describe("When a user tries to login", function () {
    it("they succeed with correct credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("test");
      cy.get("#password").type("pass");
      cy.get("#login-button").click();

      cy.contains("test logged in");
    });

    it("they fail with incorrect credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("test");
      cy.get("#password").type("wrongPass");
      cy.get("#login-button").click();

      cy.get("#notification")
        .should("contain", "Wrong username or password")
        .should("have.css", "color", "rgb(255, 0, 0)");

      cy.get("html").should("not.contain", "test logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "test", password: "pass" });
    });

    it("blogs can be created", function () {
      const newBlog = {
        title: "Blog 1",
        author: "Yasen D",
        url: "www.coolURL.com",
      };
      const newBlog2 = {
        title: "Blog 2",
        author: "Yasen D",
        url: "www.coolURL.com",
      };
      cy.addBlog(newBlog);
      cy.addBlog(newBlog2);

      cy.get("#all-blogs").should("contain", "Blog 1");
      cy.get("#all-blogs").should("contain", "Blog 2");
    });

    describe("if a user tries to delete a blog", function () {
      beforeEach(function () {
        const newBlog3 = {
          title: "Blog 3",
          author: "Yasen D",
          url: "www.coolURL.com",
        };
        const newBlog4 = {
          title: "Blog 4",
          author: "Yasen D",
          url: "www.coolURL.com",
        };
        cy.addBlog(newBlog3);
        cy.addBlog(newBlog4);
      });

      it("they succeed if they created it", function () {
        cy.contains("Blog 3")
          .contains("view")
          .click()
          .get("#delete-button")
          .click();

        cy.get("html").should("not.contain", "Blog 3");
      });

      it("they do not see the delete button if they are not the creator", function () {
        cy.contains("logout").click();

        const anotherUser = {
          name: "Dimitrov Yasen",
          username: "user2",
          password: "pass",
        };
        cy.request("POST", "http://localhost:3003/api/users", anotherUser);
        cy.login({ username: "user2", password: "pass" });

        cy.contains("Blog 4").contains("view").click();

        cy.get("html").should("not.contain", "delete");
      });
    });

    describe("and several blogs exist", function () {
      beforeEach(function () {
        const newBlog1 = {
          title: "Blog 1",
          author: "Yasen D",
          url: "www.anotherURL.com",
        };
        const newBlog2 = {
          title: "Blog 2",
          author: "Yasen D",
          url: "www.anotherURL.com",
        };
        cy.addBlog(newBlog1);
        cy.addBlog(newBlog2);
      });

      it("users can like a blog", function () {
        cy.contains("Blog 2")
          .contains("view")
          .click()
          .get("#like-button")
          .click();

        cy.get("html").contains("likes 1");
      });

      it("blogs are ordered by number of likes", function () {
        cy.contains("Blog 2")
          .contains("view")
          .click()
          .get("#like-button")
          .click();

        cy.get("#all-blogs>#blog").eq(0).should("contain", "Blog 2");
        cy.get("#all-blogs>#blog").eq(1).should("contain", "Blog 1");
      });
    });
  });
});
