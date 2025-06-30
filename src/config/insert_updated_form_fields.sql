-- Insert form sections
INSERT INTO form_sections (name, description, order_number) VALUES
('Personal Information', 'Basic personal details', 1),
('Current Occupation', 'Current employment details', 2),
('Personal availability', 'Availability and scheduling preferences', 3),
('Professional suitability', 'Professional experience and qualifications', 4),
('Personal motivation', 'Motivation and interests', 5),
('Assessment of consultation (timewise target achievable)', 'Assessment details', 6);

-- Get the section IDs
SET @personal_section := (SELECT id FROM form_sections WHERE name = 'Personal Information');
SET @occupation_section := (SELECT id FROM form_sections WHERE name = 'Current Occupation');
SET @availability_section := (SELECT id FROM form_sections WHERE name = 'Personal availability');
SET @suitability_section := (SELECT id FROM form_sections WHERE name = 'Professional suitability');
SET @motivation_section := (SELECT id FROM form_sections WHERE name = 'Personal motivation');
SET @assessment_section := (SELECT id FROM form_sections WHERE name = 'Assessment of consultation');

-- Insert form fields for Personal Information section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@personal_section, 'text', 'When would or is the post/project interested in', NULL, NULL, TRUE, 1),
(@personal_section, 'text', 'Name', NULL, NULL, TRUE, 2),
(@personal_section, 'text', 'Surname', NULL, NULL, TRUE, 3),
(@personal_section, 'date', 'Date of Birth', NULL, NULL, TRUE, 4),
(@personal_section, 'text', 'Place of Birth', NULL, NULL, TRUE, 5),
(@personal_section, 'text', 'Nationality', NULL, NULL, TRUE, 6),
(@personal_section, 'text', 'Address', NULL, NULL, TRUE, 7),
(@personal_section, 'text', 'Telephone', NULL, NULL, TRUE, 8),
(@personal_section, 'text', 'Email', NULL, NULL, TRUE, 9);

-- Insert form fields for Current Occupation section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@occupation_section, 'select', 'Current activity', NULL, '["Employed", "Unemployed", "Student", "Other"]', TRUE, 1),
(@occupation_section, 'text', 'Current employer', NULL, NULL, TRUE, 2),
(@occupation_section, 'text', 'Current position', NULL, NULL, TRUE, 3),
(@occupation_section, 'text', 'Years of experience', NULL, NULL, TRUE, 4);

-- Insert form fields for Personal availability section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@availability_section, 'select', 'Daily working shifts (early)', NULL, '["6:00-14:00", "7:00-15:00", "8:00-16:00"]', TRUE, 1),
(@availability_section, 'select', 'Daily working shifts (late)', NULL, '["14:00-22:00", "15:00-23:00", "16:00-24:00"]', TRUE, 2),
(@availability_section, 'select', 'Night shift', NULL, '["22:00-6:00", "23:00-7:00", "24:00-8:00"]', TRUE, 3),
(@availability_section, 'select', 'Weekends', NULL, '["Yes", "No"]', TRUE, 4);

-- Insert form fields for Professional suitability section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@suitability_section, 'textarea', 'Do you have an in-line specific trade (like welding, CNC turning, tool room, surface treatment) and what kind of work (2-3 years)?', NULL, NULL, TRUE, 1),
(@suitability_section, 'textarea', 'If there is overtime work?', NULL, NULL, TRUE, 2),
(@suitability_section, 'textarea', 'Are you physically fit to do heavy work?', NULL, NULL, TRUE, 3),
(@suitability_section, 'textarea', 'Do you have any medical issues?', NULL, NULL, TRUE, 4);

-- Insert form fields for Personal motivation section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@motivation_section, 'textarea', 'Why do you like this job?', NULL, NULL, TRUE, 1),
(@motivation_section, 'textarea', 'Are you a team player?', NULL, NULL, TRUE, 2),
(@motivation_section, 'textarea', 'How would you describe your personality?', NULL, NULL, TRUE, 3);

-- Insert form fields for Assessment section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@assessment_section, 'text', 'On which date would you like to start', NULL, NULL, TRUE, 1),
(@assessment_section, 'textarea', 'Remarks', NULL, NULL, FALSE, 2);
