-- Table for storing assessment links
CREATE TABLE assessment_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    expiry_date TIMESTAMP NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for storing assessment questions (fixed MCQs)
CREATE TABLE assessment_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_number INT NOT NULL,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing options for each question
CREATE TABLE assessment_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES assessment_questions(id)
);

-- Table for storing user responses
CREATE TABLE assessment_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_link_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_link_id) REFERENCES assessment_links(id),
    FOREIGN KEY (question_id) REFERENCES assessment_questions(id),
    FOREIGN KEY (selected_option_id) REFERENCES assessment_options(id)
);

-- Insert sample questions from Task 1
INSERT INTO assessment_questions (task_number, question_text) VALUES
(1, 'Students...'),
(1, 'The following applies to the classrooms of RAin/Integrationskurse Deutschland GmbH'),
(1, 'To use the lockable lockers, you must...'),
(1, 'Drinking alcohol...'),
(2, 'What are the reactions to frustration?'),
(2, 'What signs could indicate drug use?'),
(2, 'What would be considered when interacting with groups?'),
(2, 'What is a basic human need?'),
(2, 'What behavior can one expect from intoxicated people?'),
(3, 'How high is the VAT rate in Germany?'),
(3, 'What jobs can you pursue with the expert knowledge test according to Section 34a of the Trade Regulation Act (GewO)?'),
(3, 'Who is responsible for compliance with the law in Germany?'),
(3, 'How many federal states does Germany have?'),
(3, 'What is the name of the current Chancellor of Germany?');

-- Insert options for Task 1 questions
INSERT INTO assessment_options (question_id, option_text, is_correct) VALUES
-- Question 1 options
(1, 'Are not allowed to bring food to school', false),
(1, 'Are allowed to leave class any time', false),
(1, 'Must leave their cigarettes at a special point', true),

-- Question 2 options
(2, 'Students are not permitted to bring phones', false),
(2, 'Students must clean up after class', true),
(2, 'Students may study more after class', false),

-- Question 3 options
(3, 'Pay a rent fee for a key', true),
(3, 'Register a spot in the locker', false),
(3, 'Be a student for more than 6 months', false),

-- Question 4 options
(4, 'Can be consumed in the school', false),
(4, 'Must be stored in the teachers room', false),
(4, 'Is strictly prohibited', true),

-- Task 2 Questions
-- Question 5 options
(5, 'Depression', true),
(5, 'Contentment', false),
(5, 'Aggression', true),

-- Question 6 options
(6, 'Increased ability to concentrate', false),
(6, 'Social engagement', false),
(6, 'Dilated pupils, time disorientation', true),

-- Question 7 options
(7, 'Guilt exhibited', false),
(7, 'Hardly in alliance with the class', true),
(7, 'Becoming neutral', false),

-- Question 8 options
(8, 'Food', true),
(8, 'Self-actualization', false),
(8, 'Friendship', false),

-- Question 9 options
(9, 'Fear', false),
(9, 'Self-satisfaction', false),
(9, 'Friendship', true),

-- Task 3 Questions
-- Question 10 options
(10, '19%', true),
(10, 'Security point', false),
(10, 'Not given', false),

-- Question 11 options
(11, 'Tax police', false),
(11, 'The courts', true),
(11, 'The security services', false),

-- Question 12 options
(12, '15', false),
(12, '16', true),
(12, '22', false),

-- Question 13 options
(13, 'No Answer', false),
(13, '16', true),
(13, 'Mr. Scholz', false),

-- Question 14 options
(14, 'Hamburg', false),
(14, 'Merkel', false),
(14, 'Scholz', true);
