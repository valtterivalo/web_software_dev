import { executeQuery } from "../database/database.js";

const createListItem = async (list_id, item_name) => {
    await executeQuery(
        "INSERT INTO shopping_list_items (shopping_list_id, name) VALUES ($1, $2);",
        list_id, item_name,
    );
};

const findCurrentItems = async (list_id) => {
    let result = await executeQuery(
        "SELECT name, id, collected FROM shopping_list_items WHERE shopping_list_id = $1 ORDER BY collected, name;",
        list_id,
    );
    if (result.rows && result.rows.length > 0) {
        return result.rows;
    }
    return false;
};

const findAllItems = async () => {
    let result = await executeQuery("SELECT * FROM shopping_list_items")
    if (result.rows && result.rows.length > 0) {
        return result.rows;
    } else {
        return 0;
    }
};

const setCollected = async (list_id, item_id) => {
    await executeQuery(
        "UPDATE shopping_list_items " +
        "SET collected = true " +
        "WHERE shopping_list_id = $1 AND id = $2;",
        list_id, item_id,
    );
    let result = await executeQuery(
        "SELECT * FROM shopping_list_items " +
        "WHERE shopping_list_id = $1;",
        list_id,
    )
    if (result.rows && result.rows.length > 0) {
        return result.rows;
    }
    return false;
};

export {
    createListItem,
    findCurrentItems,
    setCollected,
    findAllItems,
};