import { executeQuery } from "../database/database.js";
import { redirectTo } from "../utils/requestUtils.js";

const create = async (name) => {
    await executeQuery("INSERT INTO shopping_lists (name) VALUES ($1);", name);
};


const findAllActiveLists = async () => {
    let result = await executeQuery(
        "SELECT * FROM shopping_lists WHERE active = true;",
    );
    if (result.rows && result.rows.length > 0) {
        return result.rows;
    } else {
        return false;
    }
};

const findAllLists = async () => {
    let result = await executeQuery(
        "SELECT * FROM shopping_lists;",
    );
    if (result.rows && result.rows.length > 0) {
        return result.rows;
    } else {
        return false;
    }
};

const findById = async (id) => {
    let result = await executeQuery("SELECT * FROM shopping_lists WHERE id = $1;", id);
    if (result.rows && result.rows.length > 0) {
        return result.rows[0];
    }

    return { id: 0, name: "Unknown" };
};

const deactivateList = async (id) => {
    await executeQuery("UPDATE shopping_lists " +
        "SET active = false " +
        "WHERE id = $1;",
        id)
    return;
}

export { create,
    findAllActiveLists,
    findById,
    deactivateList,
    findAllLists,
};