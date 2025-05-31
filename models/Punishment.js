const db = require('../db.js');

class Punishment {
    constructor(data) {
        this.data = data;
    }

    addSelectedPunishmentType() {
        return new Promise(async (resolve, reject) => {
            try {
                const punishmentData = {
                    baddebt: {
                        type: this.data.punishmentTypeBadDebt,
                        threshold: this.data.thresholdBadDebt
                    },
                    overdue: {
                        type: this.data.punishmentTypeOverdue,
                        threshold: this.data.thresholdOverdue
                    }
                };

                
                /*
                1. Get all keys of punishmentData object (['bad_debt', 'overdue']).
                2. Iterate through each key to check if the 'type' property has a truthy value.
                3. Return the first key where punishmentData[key].type is truthy (not null/undefined/false).
                4. If no valid key is found, it returns undefined.
                */
                const selectedContext = Object.keys(punishmentData).find(
                    key => punishmentData[key].type
                );
                // console.log(selectedContext);
                // console.log(punishmentData);
                
                

                // Prepare query with placeholders
                const query = `
                   INSERT INTO punishment_active (context, punishment_id, threshold, fine_amount, duration_in_days)
                    VALUES (?, 
                            (SELECT punishment_id FROM punishments WHERE punishment_type = ?), 
                            ?, 
                            ?, 
                            ?)
                    ON DUPLICATE KEY UPDATE 
                        punishment_id = VALUES(punishment_id),
                        threshold = VALUES(threshold),
                        fine_amount = VALUES(fine_amount),
                        duration_in_days = IF(VALUES(duration_in_days) IS NOT NULL, VALUES(duration_in_days), NULL)
                `;

                // Convert empty duration string to null
                const durationValue = this.data.duration ? parseInt(this.data.duration, 10) : null;
                
                // Prepare values array dynamically
                const values = [
                selectedContext,                        // 'bad_debt' or 'overdue'
                punishmentData[selectedContext].type,   // Corresponding punishment type
                parseInt(punishmentData[selectedContext].threshold, 10),
                null,                                   // fine_amount (null)
                durationValue                           // duration_in_days
                ];

                // Execute query using db connection
                const [result] = await db.execute(query, values);

                // Resolve promise with result if successful
                resolve({
                    message: 'Punishment successfully added!',
                });
            } catch (error) {
                // Reject promise if any error occurs
                reject({
                    message: 'Error adding punishment',
                    error: error
                });
            }
        });
    
    }

    static getPunishmentData() {
        return new Promise(async (resolve, reject) => {
            try {
                // Query to get all active punishments
                const query = `
                    SELECT context, punishment_type, threshold, fine_amount, duration_in_days
                    FROM punishment_active
                    JOIN punishments USING (punishment_id)
                `;

                // Execute query using db connection
                const [result] = await db.execute(query);

                // Resolve promise with result if successful
                resolve(result);
            } catch (error) {
                // Reject promise if any error occurs
                reject({
                    message: 'Error fetching punishment data',
                    error: error
                });
            }
        });
    }

    //old approach
    // static async addUserAndReservation(usersAboveThreshold) {
    //     /*
    //     [
    //     {
    //     user_id: 4,
    //     reservation_ids: '121, 122, 123, 165',
    //     type: 'overdue'
    //     }
    //     ]
    //     */
    //     return new Promise(async (resolve, reject) => {
    //              //first check if overdue or baddebt.
    //     try {
    //         if(usersAboveThreshold[0].type === 'overdue') {
    //             //then get the punishment applicable on it from the database
    //             const query = `
    //                 SELECT punishment_id, threshold, fine_amount, duration_in_days
    //                 FROM punishment_active
    //                 WHERE context = 'overdue'
    //             `;
    //             const [result] = await db.execute(query);//the punishment for x overdue books
    //             if (!result.length) {
    //                 console.error('Overdue punishment not found');
    //                 return;
    //             }
    //             const overduePunishment = result[0];
    //             // {
    //             //     punishment_id: 1,
    //             //     threshold: 2,
    //             //     fine_amount: null,
    //             //     duration_in_days: 4
    //             //   }
    //             //console.log(overduePunishment);



    //             //then store the punishment + user info in user_punishment and the corresponding 
    //             // reservations for which punishment is applied in punishment reservations.
    //             console.log("problem with user Punishment query if a not printed next");
    //             const userPunishmentQuery = `
    //                INSERT INTO user_punishments (user_id, punishment_id,fine_amount, duration_in_days)
    //                VALUES (?, ?, ?, ?)
    //             `;
                
    //             for (const user of usersAboveThreshold) {
    //                 const [result] = await db.execute(userPunishmentQuery, [user.user_id, overduePunishment.punishment_id, overduePunishment.fine_amount, overduePunishment.duration_in_days]);
    //                 let id = result.insertId;//primary key of user_punishment

    //                 const reservationIds = user.reservation_ids.split(', ');
    //                 for (const reservationId of reservationIds) {
    //                     const punishmentReservationsQuery = `
    //                         INSERT INTO punishment_reservations (user_punishment_id, reservation_id)
    //                         VALUES (?, ?)
    //                     `;
    //                     await db.execute(punishmentReservationsQuery, [id, reservationId]);
    //                }
    //             }

    //             //set isActive of the reservations so far to false
    //         }
    //         resolve();
    
            
    //     }
    //     catch (error) {
    //         reject(error);
    //     }      
        
    //     });
       
    // }

    //new approach
    // static async addUserAndReservation(usersAboveThreshold) {
    //     try {
    //       // Group users by their punishment context (e.g., "overdue", "baddebt", etc.)
    //       const usersByContext = usersAboveThreshold.reduce((acc, user) => {
    //         if (!acc[user.type]) {
    //           acc[user.type] = [];
    //         }
    //         acc[user.type].push(user);
    //         return acc;
    //       }, {});
      
    //       // Process each context group separately.
    //       for (const [context, users] of Object.entries(usersByContext)) {
    //         // Query for the punishment applicable for this context.
    //         const punishmentQuery = `
    //           SELECT punishment_id, threshold, fine_amount, duration_in_days
    //           FROM punishment_active
    //           WHERE context = ?
    //         `;
    //         const [punishmentResult] = await db.execute(punishmentQuery, [context]);
    //         if (!punishmentResult.length) {
    //           console.error(`Punishment not found for context: ${context}`);
    //           continue; // Skip this group if no punishment found.
    //         }
    //         const punishment = punishmentResult[0];
      
    //         // Prepare the query for inserting into user_punishments.
    //         const userPunishmentQuery = `
    //           INSERT INTO user_punishments (user_id, punishment_id, fine_amount, duration_in_days)
    //           VALUES (?, ?, ?, ?)
    //         `;
      
    //         // Loop through users in this context group.
    //         for (const user of users) {
    //           // Insert into user_punishments.
    //           const [upResult] = await db.execute(userPunishmentQuery, [
    //             user.user_id,
    //             punishment.punishment_id,
    //             punishment.fine_amount,
    //             punishment.duration_in_days,
    //           ]);
    //           // Get the auto-generated primary key (user_punishment id).
    //           const userPunishmentId = upResult.insertId;
      
    //           // Split the comma-separated reservation ids.
    //           const reservationIds = user.reservation_ids.split(', ').filter(id => id);
      
    //           // Batch insert for punishment_reservations if there are any reservation ids.
    //           if (reservationIds.length > 0) {
    //             // Construct a query with multiple value placeholders.
    //             const placeholders = reservationIds.map(() => '(?, ?)').join(', ');
    //             // Build the parameters array.
    //             const values = [];
    //             for (const resId of reservationIds) {
    //               values.push(userPunishmentId, resId);
    //             }
    //             const punishmentReservationsQuery = `
    //               INSERT INTO punishment_reservations (user_punishment_id, reservation_id)
    //               VALUES ${placeholders}
    //             `;
    //             await db.execute(punishmentReservationsQuery, values);
    //           }
    //         }
    //       }
      
    //       return; // or resolve() if you are using a promise wrapper.
    //     } catch (error) {
    //       throw error;
    //     }
    // }

    //new approach with connections
    
    static async addUserAndReservation(usersAboveThreshold) {
        let connection;
        try {
          // Get a connection from the pool
          connection = await db.getConnection();
          // Start a transaction
          await connection.beginTransaction();
      
          // Group users by their punishment context (e.g., "overdue", "baddebt", etc.)
          const usersByContext = usersAboveThreshold.reduce((acc, user) => {
            if (!acc[user.type]) {
              acc[user.type] = [];
            }
            acc[user.type].push(user);
            return acc;
          }, {});
      
          // Process each context group separately.
          for (const [context, users] of Object.entries(usersByContext)) {
            // Query for the punishment applicable for this context.
            const punishmentQuery = `
              SELECT punishment_id, threshold, fine_amount, duration_in_days
              FROM punishment_active
              WHERE context = ?
            `;
            const [punishmentResult] = await connection.execute(punishmentQuery, [context]);
            if (!punishmentResult.length) {
              console.error(`Punishment not found for context: ${context}`);
              continue; // Optionally, you might want to rollback or skip this context.
            }
            const punishment = punishmentResult[0];
      
            // Prepare the query for inserting into user_punishments.
            const userPunishmentQuery = `
              INSERT INTO user_punishments (user_id, punishment_id, fine_amount, duration_in_days, context)
              VALUES (?, ?, ?, ?, ?)
            `;
      
            // Loop through users in this context group.
            for (const user of users) {
              const [upResult] = await connection.execute(userPunishmentQuery, [
                user.user_id,
                punishment.punishment_id,
                punishment.fine_amount,
                punishment.duration_in_days,
                user.type // Add the context type to user_punishments
              ]);
              // Get the auto-generated primary key (user_punishment id).
              const userPunishmentId = upResult.insertId;
      
              // Split the comma-separated reservation ids.
              const reservationIds = user.reservation_ids.split(', ').filter(id => id);
      
              if (reservationIds.length > 0) {
                // Batch insert for punishment_reservations
                const placeholders = reservationIds.map(() => '(?, ?)').join(', ');
                const values = [];
                for (const resId of reservationIds) {
                  values.push(userPunishmentId, resId);
                }
                const punishmentReservationsQuery = `
                  INSERT INTO punishment_reservations (user_punishment_id, reservation_id)
                  VALUES ${placeholders}
                `;
                await connection.execute(punishmentReservationsQuery, values);
                // Now update the reservations table to mark these reservations as inactive(so they are not considered for punishment again).
                const updateReservationsQuery = `
                    UPDATE reservations
                    SET is_active = FALSE
                    WHERE reservation_id IN (${reservationIds.map(() => '?').join(', ')})
                `;
                await connection.execute(updateReservationsQuery, reservationIds);
              }
            }
          }
      
          // Commit the transaction if everything was successful.
          await connection.commit();
        } catch (error) {
          if (connection) {
            await connection.rollback();
          }
          throw error; // Let the caller handle the error.
        } finally {
          if (connection) {
            connection.release();
          }
        }
    }

    static async getAllPunishments() {
        return new Promise(async (resolve, reject) => {
            try {
                // const query = `
                //       SELECT 
                //           up.id AS userPunishmentid,
                //           up.user_id,
                //           u.username,
                //           up.applied_at AS data,
                //           up.status,
                //           up.fine_amount AS fine,
                //           up.duration_in_days AS duration,
                //           up.context,
                //           p.punishment_type,
                //           pr.reservation_id
                //       FROM user_punishments up, Users.users u, punishments p, punishment_reservations pr
                //       WHERE up.user_id = u.id
                //         AND up.punishment_id = p.punishment_id
                //         AND pr.user_punishment_id = up.id
                //         AND up.status IN ('active', 'completed')
                //         AND p.punishment_type IN ('fine', 'noReservations', 'deactivation');

                // `;
                const query = `
                    SELECT 
                        up.id AS userPunishmentid,
                        up.user_id,
                        u.username,
                        up.applied_at AS punishmentActivationDate,
                        up.status,
                        up.fine_amount AS fine,
                        up.duration_in_days AS duration,
                        up.context,
                        p.punishment_type,
                        GROUP_CONCAT(pr.reservation_id SEPARATOR ', ') AS reservation_ids
                    FROM user_punishments up, Users.users u, punishments p, punishment_reservations pr
                    WHERE up.user_id = u.id
                      AND up.punishment_id = p.punishment_id
                      AND pr.user_punishment_id = up.id
                      AND up.status IN ('active', 'completed')
                      AND p.punishment_type IN ('fine', 'noReservations', 'deactivation')
                    GROUP BY up.id, up.user_id, u.username, up.applied_at, up.status, up.fine_amount, up.duration_in_days, up.context, p.punishment_type;
                `;
                const [result] = await db.execute(query);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async punishmentCompletedFine(userPunishmentId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                    UPDATE user_punishments
                    SET status = 'completed'
                    WHERE id = ?
                `;
                await db.execute(query, [userPunishmentId]);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static async punishmentCancelled(userPunishmentId) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                    UPDATE user_punishments
                    SET status = 'completed'
                    WHERE id = ?
                `;
                await db.execute(query, [userPunishmentId]);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    
    static async checkUserPunishments(userName) {
        try {
            const [rows] = await db.query(
                `SELECT p.punishment_type
                 FROM user_punishments up
                 JOIN users u ON up.user_id = u.id
                 JOIN punishments p ON up.punishment_id = p.punishment_id
                 WHERE u.username = ?
                 AND up.status = 'active'`, 
                [userName]
            );
    
            // Create a punishment object with all types set to false by default
            const allPunishments = {
                noReservations: false,
                fine: false,
                deactivation: false
            };
    
            // Update the object for the active punishments
            rows.forEach(row => {
                allPunishments[row.punishment_type] = true;
            });
    
            return allPunishments;
        } catch (error) {
            console.error("Database error:", error);
            return { noReservations: false, fine: false, deactivation: false }; // Default if error
        }
    }
    
}

module.exports = Punishment;