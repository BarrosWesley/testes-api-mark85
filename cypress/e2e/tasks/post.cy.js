describe("POST /tasks", () => {
  beforeEach(function () {
    cy.fixture("tasks/post").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("register new task", function () {
    const { user, tasks } = this.tasks.create;

    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(userResp => {
        cy.task("removeTask", tasks.name, user.email);

        cy.postTask(tasks, userResp.body.token)     
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.name).to.eq(tasks.name);
                expect(response.body.tags).to.eql(tasks.tags);
                expect(response.body.is_done).to.be.false;
                expect(response.body.user).to.eq(userResp.body.user._id);
                expect(response.body._id.length).to.eq(24)
            })
        })
    })

    it("duplicated task", function () {
        const { user, tasks } = this.tasks.dup;
    
        cy.task("removeUser", user.email);
        cy.postUser(user);
    
        cy.postSession(user)
          .then(userResp => {
            cy.task("removeTask", tasks.name, user.email);

            cy.postTask(tasks, userResp.body.token)
            cy.postTask(tasks, userResp.body.token)     
                .then((response) => {
                    expect(response.status).to.eq(409);
                    expect(response.body.message).to.eq('Duplicated task!');
                })
            })
        })
})
