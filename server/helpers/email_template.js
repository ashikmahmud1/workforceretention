

// there are 4 types of client email
// ************** Client Email *********
// 1. InitialEmailTemplateOne
exports.InitialEmailTemplateOne = {
    email_type: 'template-one-email',
    editable: true,
    title: 'Initial Email - Template 1 (online survey)',
    description: 'This is the initial email that is sent to the employee inviting them to complete an on-line exit interview. Outsources systems only.',
    from_address: 'enquiries@workforceretention.com.au',
    subject: "Sorry you're leaving [client_name]",
    body: "Hi [employee_firstname],\r\n\r\n[client_name] has appointed us to manage their Exit Interview Program. They have asked us to contact and invite you to complete an on-line exit interview.\r\n\r\nIt's really important for [client_name] to capture the true sentiment of your experience. They genuinely want to translate your feedback into constructive action that will make a difference to employee retention in the future.\r\n\r\nAs independent specialists in employee retention we know that confidentiality plays a significant part in whether you can freely talk about your experience. Our process does not allow your personal responses to be disclosed to [client_name]. We'll wait until there is sufficient numbers to ensure anonimity, before functional results are collated and presented to management.\r\n\r\nThank you for taking the time to complete your exit interview. It should only take between 5-20 minutes, depending on how much feedback you'd like to contribute.\r\n\r\nPlease follow the instructions below, which detail your Login Username and Password.\r\n\r\nYour User Profile is;\r\n\r\nLogin Username: [employee_username]\r\nLogin Password: [employee_password]\r\n\r\nWorkforce Retention Employer/Employee Login Page;\r\nhttp://www.workforceretention.com.au/client_login.php\r\n\r\nPasswords and other User Profile detals can be changed by selecting 'Edit Profile' from the User Details menu.\r\n\r\nIf you have any problems with the site please do not hesitate to email us: enquiries@workforceretention.com.au\r\n\r\nAll the very best in your new endeavour!\r\n\r\nregards,\r\nWorkforce Retention"
};
// 2. InitialEmailTemplateTwo
exports.InitialEmailTemplateTwo = {
    email_type: 'template-two-email',
    editable: true,
    title: 'Initial Email - Template 2 (phone interview)',
    description: 'This is the initial email that is sent to the employee inviting them to complete an on-line exit interview. For Self-Administered systems.',
    from_address: 'enquiries@workforceretention.com.au',
    subject: "Sorry you're leaving [client_name]",
    body: "Hi [employee_firstname],\r\n\r\n[client_name] has partnered with Workforce Retention to conduct an exit interview with you, following your recent resignation.\r\n\r\nIt's really important for [client_name] to understand more about your experience, so they can address any perceived gaps and identify areas for improvement.\r\n\r\nWe will be in contact with you shortly to organise a phone based interview. Feel free to let us know a suitable day and time by replying to this email. We'll do our best to accommodate your preference. \r\n\r\nWant to get a head-start before we call you?\r\n\r\nIf you'd like to preview the interview ahead of time, you can log in to your interview via the details below. Otherwise, just wait for us to call you.\r\n\r\nTo access your exit interview, please use the details below:\r\n\r\nYour User Profile is;\r\n\r\nLogin Username: [employee_username]\r\nLogin Password: [employee_password]\r\n\r\nWorkforce Retention Employer/Employee Login Page;\r\nhttp://www.workforceretention.com.au/client_login.php\r\n\r\nPasswords and other User Profile detals can be changed by selecting Edit Profile from the User Details menu.\r\n\r\nIf you have any problems with the site please do not hesitate to email us: enquiries@workforceretention.com.au\r\n\r\nWe look forward to speaking with you soon\r\n\r\nregards,\r\nAngeline\r\nWorkforce Retention"
};
// 3. Reminder Email
exports.ReminderEmailTemplate = {
    email_type: 'reminder-email',
    editable: true,
    title: 'Reminder Email',
    description: 'This is the reminder email that is sent to employees registered who have not completed their exit interview. Outsourced Systems',
    from_address: 'enquiries@workforceretention.com.au',
    subject: "Don't forget your on-line exit interview!",
    body: "Hi [employee_firstname],\r\n\r\nJust a reminder to complete your on-line exit interview before you leave the business.\r\n\r\n[client_name] genuinely want to translate your feedback in constructive action that will make a difference to employees in the future.\r\n\r\nRemember, our process does not allow your personal responses to be disclosed to [client_name]. Once we have collated enough responses to ensure anonymity they will contribute to a comprehensive exit report for management.\r\n\r\nThank you for taking the time to complete your exit interview. It should only take between 5-20 minutes, depending on how much feedback you'd like to contribute.\r\n\r\nPlease use the Login Username and Password previously supplied to access the site. If you cannot remember your password, please visit http://www.workforceretention.com.au/reminder.php and we will issue you with a new one.\r\n\r\nThanks in advance and all the best!\r\nWorkforce Retention"
};
// 4. Manager Reports Email
exports.InitialExitManagerReportEmailTemplate = {
    email_type: 'manager-report-email',
    editable: false,
    title: 'Manager Reports',
    description: 'This is the email script that is sent to managers who have been registered to view the online reports.',
    from_address: 'enquiries@workforceretention.com.au',
    subject: "Manager Login Details",
    body: "Hi [employee_firstname],\r\n\r\nYour details have been entered into the Workforce Retention Web Database and you will soon be able to access exit interviews/reports for employees in your client group.\r\n\r\nYour User Profile is;\r\n\r\nLogin Username: [employee_username]\r\nLogin Password: [employee_password]\r\n\r\nWorkforce Retention Employer/Employee Login Page;\r\nhttp://www.workforceretention.com.au/client_login.php\r\n\r\nPasswords and other User Profile details can be changed by selecting 'Edit Profile' from the User Details menu.\r\n\r\nIf you have any problems with the site please do not hesitate to email us: enquiries@workforceretention.com.au\r\n\r\nregards,\r\nWorkforce Retention"
};
// ************** Client Email ***********

// *************** Below Email will sent when creating new client admin ***************
// 5. Client Admin Email
exports.UserEmailPasswordTemplate = {
    from_address: 'enquiries@workforceretention.com.au',
    editable: false,
    subject: "[Workforce Retention - Web Office] New user notification",
    body: "Dear [user_firstname],'\r\n\r\nYour details have been entered into the Office database for the Workforce Retention Web Office and you will soon able to access some website administration functions. \n\nYour User Profile is;\n\nFull Name: [user_firstname] [user_lastname]\nEmail: [user_email]\nLogon Username: [user_username]\nLogon Password: [user_password]\n\nWorkforce Retention Web Office: http://www.workforceretention.com.au/office\n\nIt is recommended that you change your password the first time you login to something that is easier for you to remember.\n\nPasswords and other User Profile details can be changed by clicking on your User Name in the top right-hand corner of the website Office menu-bar.\n\nIf you have any problems with the site please do not hesitate to email me: enquiries@workforceretention.com.au\n\n"
};
