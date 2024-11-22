DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS Jobs;
DROP TABLE IF EXISTS Employers;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Employers (
    employer_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(50) NOT NULL,
    employer_id INT NOT NULL,
    salary VARCHAR(50) NOT NULL,
    insurance VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    qualifications VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    FOREIGN KEY (employer_id) REFERENCES Employers(employer_id) ON DELETE CASCADE
);

CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    date_submitted DATE NOT NULL,
    user_id INT,
    job_id INT,
    interview TINYINT(1) NOT NULL DEFAULT 0,
    interview_date DATE,
    interview_status VARCHAR(20),  
    application_status VARCHAR(20) NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id) ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO Employers (employer_name, email, phone) VALUES 
('Qualcomm', 'hiring@qualcomm.com', '(858) 587-1121'),
('Longevity Physical Therapy - La Costa', 'hiring@longevityPT.com', '(760) 652-5236'),
('Lucky 7 Chinese Restaurant', 'hiring@lucky7chinese.com', '(650) 350-8964');

INSERT INTO Jobs (job_title, employer_id, salary, insurance, job_type, qualifications) VALUES
('Staff Software Engineer', 1, '$135,000-200,000 a year', 'Anthem Blue Cross Prudent Buyer PPO', 'full-time, remote', '5+ years Software Engineering experience', 'available'),
('Front Desk Receptionist', 2, '$20 an hour', 'Aetna Open Choice PPO', 'full-time', 'Familiar with Microsoft Excel and the Epic healthcare system', 'unavailable'),
('Delivery Driver', 3, '$25 an hour', 'Blue Shield of California Silver PPO', 'part-time', 'Delivery Driver experience preferred', 'unavailable');

INSERT INTO Users (first_name, last_name, email, phone) VALUES
('Jacob', 'Hawney', 'j.hawney@gmail.com', '(510) 356-1235'),
('Katie', 'Lee', 'k.lee@gmail.com', '456-789-0123'),
('Julian', 'Hanes', 'j.hanes@gmail.com', '(650) 785-2024');

INSERT INTO Applications (date_submitted, user_id, job_id, interview, interview_date, interview_status, application_status) VALUES
('2024-08-21', 1, 1, 1, '2024-11-01', 'pending', 'pending interview'),
('2024-09-04', 2, 2, 1, '2024-09-10', 'accepted', 'accepted'),
('2024-10-22', 3, 3, 0, NULL, NULL, 'accepted'),
('2024-09-04', 2, 3, 0, NULL, NULL, 'offer turned down'),
('2024-08-07', 3, 2, 1, '2024-08-12', 'rejected', 'rejected');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

