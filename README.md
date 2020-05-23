20/5/24 0400 

Web server 
============================

HGU 20-1 capstone project
----------------------------
1. server.js    Main web
2. /views				
	* Basic.ejs    page - Main page 
	* Admin_1.ejs    page - admin(setting resolution and camera's number)
	* Admin_wait.ejs    page - admin(for waiting) 
	* Admin_2.ejs	page - admin(setting ROI)
3. /source    Image source files(after deaplearning process)
4. /data
	* people.txt    (IN)data - number of people
	* camera.txt    (IN)data - IP
	* admin_input.txt	(IN)data - resolution/camera_number
	* mode.txt	(OUT)data - Admin/Basic mode
	* ROI.txt    	(OUT)data - ROI coordinates value (4xN)
	* /source_ROI    Image source files(before setting ROI)
5. /test    test code

