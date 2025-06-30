-- Insert form sections
INSERT INTO form_sections (name, description, order_number) VALUES
('Personal Information', 'Basic personal details', 1),
('Contact Details', 'Contact information', 2),
('Professional Details', 'Work and education information', 3),
('Additional Information', 'Other relevant details', 4);

-- Get the section IDs
SET @personal_section := (SELECT id FROM form_sections WHERE name = 'Personal Information');
SET @contact_section := (SELECT id FROM form_sections WHERE name = 'Contact Details');
SET @professional_section := (SELECT id FROM form_sections WHERE name = 'Professional Details');
SET @additional_section := (SELECT id FROM form_sections WHERE name = 'Additional Information');

-- Insert form fields for Personal Information section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@personal_section, 'text', 'Full Name', 'Enter your full name', NULL, TRUE, 1),
(@personal_section, 'date', 'Date of Birth', NULL, NULL, TRUE, 2),
(@personal_section, 'radio', 'Gender', NULL, '["Male", "Female", "Other"]', TRUE, 3),
(@personal_section, 'textarea', 'About Me', 'Tell us about yourself', NULL, FALSE, 4);

-- Insert form fields for Contact Details section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@contact_section, 'text', 'Email', 'Enter your email address', NULL, TRUE, 1),
(@contact_section, 'text', 'Phone Number', 'Enter your phone number', NULL, TRUE, 2),
(@contact_section, 'text', 'Address Line 1', 'Enter your street address', NULL, TRUE, 3),
(@contact_section, 'text', 'City', 'Enter your city', NULL, TRUE, 4),
(@contact_section, 'text', 'State', 'Enter your state', NULL, TRUE, 5),
(@contact_section, 'text', 'Postal Code', 'Enter your postal code', NULL, TRUE, 6);

-- Insert form fields for Professional Details section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@professional_section, 'text', 'Current Company', 'Enter your current company name', NULL, FALSE, 1),
(@professional_section, 'text', 'Job Title', 'Enter your job title', NULL, FALSE, 2),
(@professional_section, 'number', 'Years of Experience', 'Enter years of experience', NULL, FALSE, 3),
(@professional_section, 'select', 'Education Level', NULL, '["High School", "Bachelor\'s", "Master\'s", "PhD", "Other"]', TRUE, 4);

-- Insert form fields for Additional Information section
INSERT INTO form_fields (section_id, field_type, label, placeholder, options, is_required, order_number) VALUES
(@additional_section, 'checkbox', 'Skills', NULL, '["Programming", "Design", "Marketing", "Sales", "Management"]', FALSE, 1),
(@additional_section, 'textarea', 'Additional Comments', 'Any additional information you would like to share', NULL, FALSE, 2),
(@additional_section, 'signature', 'Signature', 'Please sign here', NULL, TRUE, 3);
