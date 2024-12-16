USE RIDESYNC_DB;


ALTER TABLE Users
ADD Gender CHAR(1) CHECK (Gender IN ('M', 'F')),  -- Gender column with a check constraint for 'M' (Male) or 'F' (Female)
ADD Country VARCHAR(50) NULL,                          -- Country column to store the user's country
ADD DemoStat VARCHAR(50) NULL;                         -- DemoStat column to store demographic status or other info
