'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(async (req, res) => {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).json({ error: "Required fields missing" });
      }

      try {
        const issue = new Issue({
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        })

        const savedIssue = await issue.save();
        res.status(201).json(savedIssue);
      } catch (err) {
        console.log("There was an error while creating issue: ", err)
      }
      res.status(201).json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
