
 USE RIDESYNC_DB;
-- DESCRIBE USERS;


SELECT *FROM USERS;
SELECT * FROM Routes;		
SELECT * FROM PotentialDrivers;
SELECT * FROM Rides;
SELECT * FROM Booking;
SELECT * FROM Chats;
SELECT * FROM Messages;
SELECT * FROM Vehicle;
SELECT * FROM CarpoolRoutes;
SELECT * FROM CarpoolPassengers;
SELECT * FROM Ratings;
 
 UPDATE CarpoolRoutes
 SET status = 'completed'
 WHERE routeId  = 4;



SELECT  u.*
FROM CarpoolPassengers as cp
INNER JOIN Users as u on u.userId = cp.passengerId
WHERE carpoolRouteId = 4;


SELECT *
FROM Users;

SELECT *
FROM CarpoolPassengers;


 
 SELECT * 
 FROM CarpoolRoutes as cr
 WHERE cr.userId = 32;
 


SELECT u.*
FROM CarpoolPassengers as c 
INNER JOIN Users as u ON u.userId = c.passengerId
WHERE carpoolRouteId = 1;
 

SELECT routeId
FROM Routes
WHERE status = 'Cancelled' AND userId = 30
ORDER BY routeId DESC
LIMIT 1;

 
 
 
 SELECT u.*, 
       v.vehicleId, 
       v.userId AS driverId, 
       v.carType, 
       v.manufacturerName, 
       v.modelName, 
       v.modelYear, 
       v.vehiclePlateNo, 
       v.vehicleSets, 
       v.vehicleColor, 
       v.typeRide
FROM USERS AS u
LEFT JOIN Vehicle AS v ON v.userId = u.userId
WHERE u.userType IN ('D', 'P');

 
 
 
 INSERT INTO Ratings (user_id, rating) VALUES 
(?, ?);


-- Update the Users table with the newly computed ratings
UPDATE Users u
JOIN (
    SELECT 
        user_id,
        ROUND(AVG(CAST(rating AS DECIMAL(10, 2))), 2) AS average_rating
    FROM 
        Ratings
    GROUP BY 
        user_id
) r ON u.userId = r.user_id
SET u.userRating = r.average_rating;



 
 
 
  SELECT  r.routeId, r.userId,r.startLocation, r.endLocation, r.estimatedDuration,
            r.distance, r.totalAmount, r.startLatitude,r.startLongitude, r.endLatitude,
            r.endLongitude, b.driverId, b.trip,b.numPassengers,b.rideType,b.travelDate,
             d.userId as 'driverId', d.userId , d.userFn, d.userLn, d.userEmail , d.userPhone,d.userRating 
            FROM Routes AS r
            JOIN Booking AS b ON r.routeId = b.routeId
            JOIN Users AS p ON p.userId = b.userId
            JOIN Users AS d ON d.userId = b.driverId
            WHERE b.status = 'booking'
            AND p.userType = 'P' 
            AND p.userId = 30;
 
 
 SELECT * 
 FROM Routes as r
 JOIN Booking as b On b.routeId = r.routeId
 WHERE b.driverId = 31 AND r.status = 'cancelled';
 
 
 SELECT  
    r.routeId,
    r.userId,
    r.startLocation,
    r.endLocation,
    r.estimatedDuration,
    r.distance,
    r.totalAmount,
    r.startLatitude,
    r.startLongitude,
    r.endLatitude,
    r.endLongitude,
    r.status,
    COALESCE(d.userFn, dd.userFn, 'No Driver') AS userFn,  -- Use dd if d is null
    COALESCE(d.userLn, dd.userLn, 'No Last Name') AS userLn,  -- Use dd if d is null
    COALESCE(d.userRating, dd.userRating, 0) AS userRating,  -- Use dd if d is null
    COALESCE(d.userEmail, dd.userEmail, 'No Email') AS userEmail,  -- Use dd if d is null
    COALESCE(d.userPhone, dd.userPhone, 'No Phone') AS userPhone,  -- Use dd if d is null
    COALESCE(v.vehiclePlateNo, vv.vehiclePlateNo, 'No Plate') AS vehiclePlateNo,  -- Use vv if v is null
    COALESCE(v.vehicleColor, vv.vehicleColor, 'No Color') AS vehicleColor,  -- Use vv if v is null
    b.routeId AS bookingRouteId  -- Add booking route ID to get routes from Booking table
FROM 
    Routes AS r
LEFT JOIN 
    Booking AS b ON b.routeId = r.routeId  -- Include routes based on booking
INNER JOIN 
    Users AS u ON u.userId = r.userId  -- User who created the route
LEFT JOIN 
    Rides AS rd ON rd.routeId = r.routeId  -- Include rides for the route
LEFT JOIN 
    Users AS d ON d.userId = rd.driverId  
LEFT JOIN 
    Users AS dd ON dd.userId = b.driverId    
LEFT JOIN 
    Vehicle AS v ON v.userId = rd.driverId  -- Vehicle info for the driver in the ride
LEFT JOIN 
    Vehicle AS vv ON vv.userId = b.driverId  -- Vehicle info for the driver in the booking
WHERE 
    r.status != 'booking' AND r.status != 'Cancelled'
    AND r.userId = 30;  -- Get routes for the passenger (user with ID 30)

-- Inserting sample values into the Ratings table














 SELECT  
    r.routeId, 
    r.userId, 
    r.startLocation, 
    r.endLocation, 
    r.estimatedDuration, 
    r.distance, 
    r.totalAmount, 
    r.startLatitude, 
    r.startLongitude, 
    r.endLatitude, 
    r.endLongitude, 
    r.status, 
    u.userFn, 
    u.userLn, 
    u.userRating, 
    u.userEmail, 
    u.userPhone,
    rd.routeId AS rideRouteId,
    b.routeId AS bookingRouteId
FROM 
    Routes AS r
 LEFT JOIN 
    Rides AS rd ON rd.routeId = r.routeId AND rd.driverId = 31  
 INNER JOIN 
    Users AS u ON u.userId = r.userId
LEFT JOIN 
    Booking AS b ON b.routeId = r.routeId AND b.driverId = 31
WHERE 
    r.status NOT IN ('booking', 'Cancelled') 
    AND (rd.routeId IS NOT NULL OR b.routeId IS NOT NULL)
    AND (rd.driverId IS NULL OR rd.driverId = 31);











 SELECT 
                r.routeId,r.userId,r.startLocation,r.endLocation,r.estimatedDuration,r.distance,
                r.totalAmount,r.startLatitude,r.startLongitude,r.endLatitude,r.endLongitude,
                b.driverId,b.trip,b.numPassengers,b.rideType,b.travelDate,d.userFn,d.userLn,
                d.userEmail,d.userPhone,d.userRating
          FROM  Routes AS r
          JOIN  Booking AS b ON r.routeId = b.routeId	
          JOIN Users as d ON d.userId = b.userId
          JOIN Users AS u On u.userId = b.driverId
          WHERE r.status = 'booking' AND u.userType = 'D' AND u.userId = 31;


UPDATE Booking 
SET status = 'cancelled' 
WHERE routeId = 38;
UPDATE Routes 
SET status = 'Cancelled' 
WHERE routeId = 38;


SELECT  r.routeId, r.userId,r.startLocation, r.endLocation, r.estimatedDuration,
            r.distance, r.totalAmount, r.startLatitude,r.startLongitude, r.endLatitude,
            r.endLongitude, b.driverId, b.trip,b.numPassengers,b.rideType,b.travelDate,
            d.userFn, d.userLn, d.userEmail , d.userPhone,d.userRating 
            FROM Routes AS r
            JOIN Booking AS b ON r.routeId = b.routeId
            JOIN Users AS p ON p.userId = b.userId
            JOIN Users AS d ON d.userId = b.driverId
            WHERE r.status = 'booking'
            AND p.userType = 'P' 
            AND p.userId = 30; 




SELECT * 
FROM CarpoolPassengers as cp
JOIN CarpoolRoutes as c ON c.routeId =   cp.carpoolRouteId
JOIN Users as u ON u.userId = cp.driverId
JOIN Vehicle as v ON v.userId = u.userId
WHERE passengerId  = 30;

 SELECT  r.routeId,r.userId, r.startLocation,r.endLocation, r.estimatedDuration, r.distance, r.totalAmount,
        r.startLatitude, r.startLongitude,r.endLatitude,r.endLongitude,r.status,
        d.userFn,d.userLn,d.userRating,d.userEmail,d.userPhone,v.vehiclePlateNo,v.vehicleColor
        FROM 
            Rides AS rd
        INNER JOIN 
            Routes AS r ON rd.routeId = r.routeId
         JOIN
            Users AS u  On u.userId = r.userId   
		JOIN Users AS d ON d.userId = rd.driverId
        JOIN Vehicle AS v ON v.userId = rd.driverId

        WHERE 
            r.status != 'booking' AND r.status != 'Cancelled' and rd.routeId = r.routeId AND r.userId = 34;
           

SELECT * 
FROM CarpoolPassengers
WHERE carpoolRouteId = 2 AND passengerId = 30;

       SELECT 
  c.routeId,
  c.userId ,
  c.startLocation,
  c.endLocation,
  c.duration,
  c.distance,
  c.startLatitude,
  c.startLongitude,
  c.endLatitude,
  c.endLongitude,
  c.travelDateTime,
  c.NumSets,
  c.vehicle,
  c.pricePerPerson,
  c.paymentMethod,
  c.status,
  c.totalAmount,
  (
    SELECT IFNULL(SUM(p.numPassengersBooked), 0)
    FROM CarpoolPassengers p
    WHERE p.driverId = c.userId AND p.carpoolRouteId = c.routeId
  ) AS totalPassengersBooked
FROM CarpoolRoutes c;



SELECT 
  c.routeId,
  c.userId ,
  c.startLocation,
  c.endLocation,
  c.duration,
  c.distance,
  c.startLatitude,
  c.startLongitude,
  c.endLatitude,
  c.endLongitude,
  c.travelDateTime,
  c.NumSets,
  c.vehicle,
  c.pricePerPerson,
  c.paymentMethod,
  c.status,
  c.totalAmount,
  (
    SELECT IFNULL(SUM(p.numPassengersBooked), 0)
    FROM CarpoolPassengers p
    WHERE p.driverId = c.userId AND p.carpoolRouteId = c.routeId
  ) AS totalPassengersBooked
FROM CarpoolRoutes c;

 
 
 
 
SELECT * 
FROM CarpoolRoutes
WHERE userId = 28; 

 
SELECT u.userId, u.userType, dr.typeRide
FROM Users as u
JOIN Vehicle as dr ON u.userId = dr.userId
WHERE u.userId = 26;
 
 
 
  SELECT 
                r.routeId,r.userId,r.startLocation,r.endLocation,r.estimatedDuration,r.distance,
                r.totalAmount,r.startLatitude,r.startLongitude,r.endLatitude,r.endLongitude,
                b.driverId,b.trip,b.numPassengers,b.rideType,b.travelDate,u.userFn,u.userLn,
                u.userEmail,u.userPhone,u.userRating
          FROM  Routes AS r
          JOIN  Booking AS b ON r.routeId = b.routeId	
          JOIN Users AS u On u.userId = b.userId
          WHERE r.status = 'booking' AND u.userType = 'P' AND u.userId = 12;
 
 
 
SELECT sender_Id,message, timeSend
FROM Messages 
WHERE chatId = 1 ;

INSERT INTO Messages (chatId, sender_Id, message, timeSend)
    VALUES (1, 12,'hello' ,CURRENT_TIMESTAMP);
 
 -- passenger
 SELECT  c.chatId, c.user2_Id,
		 u.userFn,u.userLn
 FROM Chats AS c
 JOIN Users AS u ON u.userId = c.user2_Id
 WHERE c.user1_Id = 9;
 

  -- driver
 SELECT  c.chatId, c.user1_Id,
		 u.userFn,u.userLn
 FROM Chats AS c
 JOIN Users AS u ON u.userId = c.user1_Id
 WHERE c.user2_Id = ?;
 
 
 
 SELECT rd.driverId 
 FROM Rides AS rd
 JOIN Routes  AS r ON r.routeId = rd.routeId
 JOIN Users AS u ON u.userId = r.userId
 WHERE rd.rideStatus ='onGoing' AND u.userId = 9;
 
 
 
SELECT r.routeId,r.userId,r.startLocation,r.endLocation,r.estimatedDuration,r.distance,r.totalAmount,
        r.startLatitude, r.startLongitude, r.endLatitude, r.endLongitude,r.status,
        u.userFn,u.userLn,u.userRating,u.userEmail
FROM  Routes r
INNER JOIN
Users AS u  On u.userId = r.userId   
WHERE 
r.status = 'Completed' OR r.status='onGoing'  AND r.userId =  9;
 
SELECT * FROM Rides where rideStatus = 'pending';

SELECT 
    r.routeId,
    r.userId,
    r.startLocation,
    r.endLocation,
    r.estimatedDuration,
    r.distance,
    r.totalAmount,
    r.startLatitude,
    r.startLongitude,
    r.endLatitude,
    r.endLongitude,
    r.status,
	u.userFn,
    u.userLn,
    u.userRating,
    u.userEmail,
    rd.driverId
FROM 
    Rides AS rd
INNER JOIN 
    Routes AS r ON rd.routeId = r.routeId
INNER JOIN
	Users AS u  On u.userId = rd.driverId   
WHERE 
    r.status != 'booking' AND r.status != 'Cancelled' and rd.routeId = r.routeId AND r.userId = 9;

 
 SELECT 
    r.routeId,
    r.userId,
    r.startLocation,
    r.endLocation,
    r.estimatedDuration,
    r.distance,
    r.totalAmount,
    r.startLatitude,
    r.startLongitude,
    r.endLatitude,
    r.endLongitude,
    b.driverId,
    b.trip,
    b.numPassengers,
    b.rideType,
    b.travelDate,
    u.userFn,
    u.userLn,
    u.userRating,
    u.userEmail
FROM Booking AS b 
JOIN  Routes AS r  ON r.routeId = b.routeId
JOIN Users AS u on r.userId = u.userId
WHERE 
   r.status = 'booking' AND b.driverId = 12;
 
 
 
--   truncate table CarpoolRoutes;
--  
--   truncate table Chats;
--    truncate table Messages;
-- --  
--  
--   ALTER TABLE Rides DROP FOREIGN KEY rides_ibfk_1;
--  truncate table Routes;
--    truncate table Rides;
--   truncate table PotentialDrivers;
--   truncate table Booking;