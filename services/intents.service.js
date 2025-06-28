import pool from './../config/db.config.js'

export const createIntents = async (orderData) => {
  const client = await pool.connect();
  
  try {
    const { messId, headCount, totalAmount, selectedItems, timestamp, userid } = orderData.body;

    await client.query('BEGIN');

    // Insert into orders table
    const orderInsertQuery = `
      INSERT INTO intents (mess_id, head_count, total_amount, order_time, user_id )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const orderResult = await client.query(orderInsertQuery, [messId, headCount, totalAmount, new Date(), userid ]);
    const orderId = orderResult.rows[0].id;

    // Insert order items
    const itemInsertQuery = `
      INSERT INTO order_items (order_id, item_name, quantity, price_per_unit)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of selectedItems) {
       const itemName = item.item.name;
       const quantity = item.quantity;
       const pricePerUnit = item.item.price;
      await client.query(itemInsertQuery, [orderId, itemName, quantity, pricePerUnit]);
    }

    await client.query('COMMIT');

    return { success: true, orderId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// export const getIntentsByUserId = async (userId) => {
//   try {
//     // Fetch all orders for the user
//     const ordersResult = await pool.query(`
//       SELECT * FROM intents
//       WHERE user_id = $1
//       ORDER BY order_time DESC
//     `, [userId]);

//     const orders = ordersResult.rows;

//     const finalOrders = [];

//     // Fetch items for each order
//     for (const order of orders) {
//       const itemsResult = await pool.query(`
//         SELECT item_name AS "itemName", quantity, price_per_unit AS "pricePerUnit"
//         FROM order_items
//         WHERE order_id = $1
//       `, [order.id]);

//       const selectedItems = itemsResult.rows;

//       // Reconstruct the original structure
//       finalOrders.push({
//         userId: order.user_id,
//         messId: order.mess_id,
//         messName: order.mess_name, // Only if you are storing it. If not, fetch it using messId.
//         headCount: order.head_count,
//         totalAmount: order.total_amount,
//         timestamp: order.order_time,
//         selectedItems
//       });
//     }

//     return finalOrders;

//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     throw error;
//   }
// };

export const getIntentsByUserId = async (userId) => {
  try {
    // Fetch all orders along with mess name in one query
    const intentsResult = await pool.query(`
      SELECT o.id AS order_id, o.mess_id, m.name AS mess_name, o.head_count, o.total_amount, o.order_time
      FROM intents o
      JOIN messes m ON o.mess_id = m.id
      WHERE o.user_id = $1
      ORDER BY o.order_time DESC
    `, [userId]);

    const intents = intentsResult.rows;

    if (intents.length === 0) return [];

    // Fetch all items for all orders in one go
    const intentsIds = intents.map(order => order.order_id);

    const itemsResult = await pool.query(`
      SELECT order_id, item_name AS "itemName", quantity, price_per_unit AS "pricePerUnit"
      FROM order_items
      WHERE order_id = ANY($1)
    `, [intentsIds]);

    const itemsByIntents = {};
    for (const item of itemsResult.rows) {
      if (!itemsByIntents[item.order_id]) {
        itemsByIntents[item.order_id] = [];
      }
      itemsByIntents[item.order_id].push({
        itemName: item.itemName,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit
      });
    }

    // Build final response
    const finalOrders = intents.map(intent => ({
      userId,
      messId: intent.mess_id,
      messName: intent.mess_name,
      headCount: intent.head_count,
      totalAmount: intent.total_amount,
      timestamp: intent.order_time,
      selectedItems: itemsByIntents[intent.order_id] || []
    }));

    return finalOrders;

  } catch (error) {
    console.error('Error fetching user Intents:', error);
    throw error;
  }
};





