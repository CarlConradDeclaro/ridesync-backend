-- CREATE DATABASE RIDESYNC_DB;
-- USE RIDESYNC_DB;

CREATE TABLE Users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  userLn VARCHAR(50) NOT NULL,
  userFn VARCHAR(50) NOT NULL,
  userEmail VARCHAR(50) NOT NULL UNIQUE,
  userPhone VARCHAR(20)  NULL,
  age INT NULL CHECK (age >= 0),
  userPassword VARCHAR(255)  NULL,
  userType CHAR(1) NOT NULL CHECK (userType IN ('P', 'D', 'A')),
  userRating FLOAT DEFAULT 0.0,
  Gender CHAR(1) CHECK (Gender IN ('M', 'F')) NULL,  
  Country VARCHAR(50)  DEFAULT 'Philippines' NULL,  -- //                        
  DemoStat VARCHAR(50) NULL,   -- //   
  typeRide VARCHAR(20) NULL
);



 

CREATE TABLE Routes(
    routeId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    startLocation VARCHAR(250) NOT NULL,
    endLocation  VARCHAR(250) NOT NULL,
    estimatedDuration DECIMAL(5,2) NOT NULL,
    distance DECIMAL(5,2) NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'pending',
	startLatitude DECIMAL(10, 6) NOT NULL,
	startLongitude DECIMAL(10, 6) NOT NULL,
	endLatitude DECIMAL(10, 6) NOT NULL,
	endLongitude DECIMAL(10, 6) NOT NULL
);


CREATE TABLE PotentialDrivers(
  pdId INT PRIMARY KEY AUTO_INCREMENT,
  driverId INT NOT NULL,
  passengerId INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  FOREIGN KEY (driverId) REFERENCES Users(userId) ON DELETE CASCADE,
  FOREIGN KEY (passengerId) REFERENCES Users(userId) ON DELETE CASCADE
);

CREATE TABLE Rides(
	rideId INT PRIMARY KEY AUTO_INCREMENT,
    driverId  INT,
    routeId INT,
    vehicleId INT,
    rideType VARCHAR(20) ,
    departureTime TIME,
    availableSeats int,
    rideStatus VARCHAR(20) NULL DEFAULT 'pending'
);

CREATE TABLE BOOKING(
   bookId INT PRIMARY KEY AUTO_INCREMENT,
   userId INT,
   driverId INT,
   routeId INT,
   trip  VARCHAR(20),
   numPassengers INT,
   rideType VARCHAR(20),
   travelDate DATETIME,
   status varchar(20) NULL DEFAULT 'pending'
);


CREATE TABLE Chats(
  chatId INT PRIMARY KEY AUTO_INCREMENT,
  user1_Id INT,
  user2_Id INT
);

CREATE TABLE Messages(
  messageId INT PRIMARY KEY AUTO_INCREMENT,
  chatId INT,
  sender_Id INT,
  message VARCHAR(255),
  timeSend TIMESTAMP
);
	
    
 CREATE TABLE Vehicle(
  vehicleId INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  carType VARCHAR(20),
  manufacturerName VARCHAR(20),
  modelName VARCHAR(20),
  modelYear INT,
  vehiclePlateNo VARCHAR(20),
  vehicleSets INT,
  vehicleColor VARCHAR(20),
  typeRide VARCHAR(20)
 );


CREATE TABLE CarpoolRoutes(
  routeId INT  PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  startLocation VARCHAR(250) NOT NULL,
  endLocation  VARCHAR(250) NOT NULL,
  duration DECIMAL(5,2) NOT NULL,
  distance DECIMAL(5,2) NOT NULL,
  startLatitude DECIMAL(10, 6) NOT NULL,
  startLongitude DECIMAL(10, 6) NOT NULL,
  endLatitude DECIMAL(10, 6) NOT NULL,
  endLongitude DECIMAL(10, 6) NOT NULL,
  travelDateTime DATETIME,
  NumSets INT,
  vehicle VARCHAR(20),
  pricePerPerson INT,
  paymentMethod VARCHAR(20),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  totalAmount INT
);

CREATE TABLE CarpoolPassengers (
   id INT  PRIMARY KEY AUTO_INCREMENT,
   passengerId INT,
   carpoolRouteId INT,
   driverId INT,
   numPassengersBooked INT 
 );

 
 CREATE TABLE Ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    rating INT NOT NULL DEFAULT 5
);


 
 
 
 
 
 
 
 SET SQL_SAFE_UPDATES = 0;


ALTER TABLE Rides
ADD CONSTRAINT 
FOREIGN KEY (routeId)
REFERENCES Routes(routeId);
 
