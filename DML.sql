--CRUD Operation Queries for Users table

--create a new User entry
INSERT INTO Users (first_name, last_name, email, phone)
VALUES 
(:first_name_input, :last_name_input, :email_input, :phone_number_input);

-- get all Users information for the browse Users page
SELECT * FROM Users;

--get a single User's information for the update form
SELECT * FROM Users
WHERE user_id = :user_id_for_update_form;

--update a User from update form
UPDATE Users
SET first_name = :first_name_input,
last_name = :last_name_input,
email = :email_input,
phone = :phone_number_input
WHERE user_id = :user_id_update;

--delete a User
DELETE FROM Users
WHERE user_id = :user_id_delete;

--CRUD Operation Queries for Applications table

--create a new Application entry
INSERT INTO Applications (date_submitted, user_id, job_id, interview, interview_date, interview_status, application_status)
VALUES 
(:date_submitted_input, :user_id_input, :job_id_input, :interview_input, :interview_date_input, :interview_status_input, :application_status_input);

--get all Application information for the browse Applications page
SELECT * FROM Applications;

--get a single Application's information for the update form
SELECT * FROM Applications
WHERE application_id = :application_id_for_update_form;

--update an Application from update form
UPDATE Applications
SET date_submitted = :date_submitted_input,
user_id = :user_id_input,
job_id = :job_id_input,
interview = :interview_input,
interview_date = :interview_date_input,
interview_status = :interview_status_input,
application_status = :application_status_input
WHERE application_id = :application_id_update;

--delete an Application
DELETE FROM Applications
WHERE application_id = :application_id_delete;

--CRUD Operation Queries for Jobs Table

--create a new Job
INSERT INTO Jobs (job_title, employer_id, salary, insurance, job_type, qualifications) 
VALUES
(:job_title_input, :employer_id_input, :salary_input, :insurance_input, :job_type_input, :qualifications_input);

--get all Job information for the browse Jobs page
SELECT * FROM Jobs;

--get a single Job's information for the update form
SELECT * FROM Jobs
WHERE job_id = :job_id_for_update_form;

--update a Job from update form
UPDATE Jobs
SET job_id = :job_title_input,
employer_id = :employer_id_input,
salary = :salary_input,
insurance = :insurance_input,
job_type = :job_type_input,
qualifications = :qualifications_input
WHERE job_id = :job_id_update;

--delete a Job 
DELETE FROM Jobs
WHERE job_id = :job_id_delete;

--CRUD Operation Queries for Employers

--create a new Employer
INSERT INTO Employers (employer_name, email, phone)
VALUES
(:emloyer_name_input, :email_input, :phone_number_input);

--get all Employer information for the browse Employers page
SELECT * FROM Employers;

--get a single Employer's information for the update form
SELECT * FROM Employers 
WHERE employer_id = :employer_id_for_update_form;

--update an Employer from update form
UPDATE Employers
SET employer_name = :employer_name_input,
email = :email_input,
phone = :phone_number_input
WHERE employer_id = :employer_id_update;

--delete an Employer
DELETE FROM Employers
WHERE employer_id = :employer_id_delete;
