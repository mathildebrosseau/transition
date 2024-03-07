/*
 * Copyright 2024, Polytechnique Montreal and contributors
 *
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 */
import knex from '../../config/shared/db.config';
import { exists, update, deleteRecord } from './default.db.queries';
import TrError from 'chaire-lib-common/lib/utils/TrError';
import { randomUUID } from 'crypto';
import { TokenAttributes } from '../../services/auth/token';


const tableName = 'tokens';
const userTableName = 'users';

const attributesCleaner = function (attributes: TokenAttributes): { user_id: number; api_token: string } {
    const { user_id, api_token } = attributes;
    const _attributes: any = {
        number: user_id,
        string: api_token
    };

    return _attributes;
};

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const attributesParser = (dbAttributes: { user_id: number; api_token: string }): TokenAttributes => ({
    user_id: dbAttributes.user_id,
=======
const attributesParser = (dbAttributes: {
    id: number;
    api_token: string;
}): TokenAttributes => ({
=======
const attributesParser = (dbAttributes: { id: number; api_token: string }): TokenAttributes => ({
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
    id: dbAttributes.id,
>>>>>>> 241bdeb (api-authentication: add new migrations, auth middleware to endpoints and passport strategy)
    api_token: dbAttributes.api_token
=======
const attributesParser = (dbAttributes: { id: number; apiToken: string; expiryDate:string; creationDate:string }): TokenAttributes => ({
    id: dbAttributes.id,
    api_token: dbAttributes.apiToken,
    expiry_date: dbAttributes.expiryDate,
    creation_date: dbAttributes.creationDate
>>>>>>> 4416698 (modify parser)
});

const getOrCreate = async (usernameOrEmail: string): Promise<string> => {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
        const user_id = await knex(userTableName)
=======
        const id = await knex(userTableName)
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
            .where(function () {
                this.where('username', usernameOrEmail).orWhere('email', usernameOrEmail);
            })
            .then(async (row) => {
                if (row === undefined) {
<<<<<<< HEAD
                    throw new TrError(
                        `Could not match ${usernameOrEmail} in table ${tableName} database`,
                        'DBUTK0001',
                        'NoUserMatchError'
                    );
                }
                if (row.length < 1) {
                    throw new TrError(
                        `Could not match ${usernameOrEmail} in table ${tableName} database`,
                        'DBUTK0002',
                        'NoUserMatchError'
                    );
=======
                    throw 'An error has occured: No username or email to this name.';
                }
                if (row.length < 1) {
                    throw 'An error has occured: No match found';
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
                } else {
                    return row[0].id;
                }
            });
<<<<<<< HEAD
<<<<<<< HEAD
        const row = await knex(tableName).where('user_id', user_id);
        if (row[0]) {
            return row[0].api_token;
        }
        const apiToken = randomUUID();
        const newObject: TokenAttributes = { user_id: user_id, api_token: apiToken };
        await knex(tableName).insert(newObject);
        return apiToken;
    } catch (error) {
        throw TrError.isTrError(error)
            ? error
            : new TrError(
                `Cannot add api_token to user ${usernameOrEmail} in table ${tableName} database (knex error: ${error})`,
                'DBUTK0003',
                'DatabaseCannotCreateBecauseDatabaseError'
            );
    }
};

const getById = async (user_id: number): Promise<TokenAttributes | undefined> => {
    try {
        const response = await knex(tableName).where({ user_id });
        if (response.length < 1) {
            throw new TrError(`No such id in ${tableName} table.`, 'DBUTK0004', 'DatabaseNoUserMatchesProvidedToken');
        }
        return response[0] as TokenAttributes;
    } catch (error) {
        throw TrError.isTrError(error)
            ? error
            : new TrError(`No such id in ${tableName} table.`, 'DBUTK0006', 'UnknownErrorFromDatabase');
    }
};

const getUserByToken = async (token: string) => {
    try {
        const user_id = await knex(tableName).where('api_token', token);
        if (user_id.length < 1) {
            throw new TrError(`No such id in ${tableName} table.`, 'DBUTK0004', 'DatabaseNoUserMatchesProvidedToken');
        }
        const user = (await knex(userTableName).where('id', user_id[0].user_id))[0];

        if (!user) {
            throw new TrError('Error, mismatch between user and user_id', 'DBUTK0005', 'DatabaseNoUserMatchesToken');
=======
        const id = await knex(userTableName).where(function() {
            this.where('username', usernameOrEmail ).orWhere('email', usernameOrEmail)
          })
        .then(async (row) => {
            if (row === undefined) {
                throw("An error has occured: No username or email to this name.")
            }
            if (row.length < 1) {
                throw("An error has occured: No match found")
            } else {
                return row[0].id
            }
        })
        const apiToken = randomUUID()
        const newObject: TokenAttributes = {id: id, api_token: apiToken}
        const row = await knex(tableName).where('id', id)
=======
        const apiToken = randomUUID();
        const newObject: TokenAttributes = { id: id, api_token: apiToken };
=======
>>>>>>> 4416698 (modify parser)
        const row = await knex(tableName).where('id', id);
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
        if (row[0]) {
            return row[0].api_token;
        }
        const apiToken = randomUUID();
        const newObject: TokenAttributes = { id: id, api_token: apiToken, expiry_date: knex.raw("CURRENT_TIMESTAMP - interval '1 week'"), creation_date: knex.raw('CURRENT_TIMESTAMP')};
        await knex(tableName).insert(newObject);
        return apiToken;
    } catch (error) {
        throw new TrError(
            `Cannot add api_token to user ${usernameOrEmail} in table ${tableName} database (knex error: ${error})`,
            'ERRORCODE',
            'DatabaseCannotCreateBecauseDatabaseError'
        );
    }
};

const getById = async (id: number): Promise<TokenAttributes | undefined> => {
    try {
        const response = await knex(tableName).where({ id });
        if (response.length === 1) {
            return response[0] as TokenAttributes;
        }
        return undefined;
    } catch (error) {
        console.error(`cannot get token by ID ${id} (knex error: ${error})`);
        return undefined;
    }
};

const read = async (id: string) => {
    try {
        if (!uuidValidate(id)) {
            throw new TrError(
                `Cannot read object from table ${tableName} because the required parameter id is missing, blank or not a valid uuid`,
                '!!What is this string!!',
                'DatabaseCannotReadTokenBecauseIdIsMissingOrInvalid'
            );
        }
        const response = await knex.raw(`
      SELECT
        *
      FROM ${tableName}
      WHERE id = '${id}';
    `);
        const rows = response?.rows;
        if (rows && rows.length !== 1) {
            throw new TrError(
                `Cannot find object with id ${id} from table ${tableName}`,
                '!!What is this string!!',
                'DatabaseCannotReadTokenBecauseObjectDoesNotExist'
            );
        }
        return attributesParser(rows[0]);
    } catch (error) {
        throw new TrError(
            `Cannot read object with id ${id} from table ${tableName} (knex error: ${error})`,
            'DBQZONE0003',
            'DatabaseCannotReadTokenBecauseDatabaseError'
        );
    }
};

const match = async (token: string) => {
    try {
        const response = await knex(tableName).where('api_token', token);
        if (response.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(`cannot get token ${token} (knex error: ${error})`);
        return false;
    }
};

const getUserByToken = async (token: string) => {
    try {
        const id = await knex(tableName).where('api_token', token)[0].id;

        if (!id) {
            throw `No such id in ${tableName} table.`;
        }

        const user = await knex(userTableName).where('id', id)[0];

        if (!user) {
<<<<<<< HEAD
            throw('Error, mismatch between user and id')
>>>>>>> 241bdeb (api-authentication: add new migrations, auth middleware to endpoints and passport strategy)
=======
            throw 'Error, mismatch between user and id';
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
        }

        return user;
    } catch (error) {
<<<<<<< HEAD
        throw TrError.isTrError(error)
            ? error
            : new TrError(
                `Cannot get user in table ${tableName} database from token ${token}: (knex error: ${error})`,
                'DBUTK0003',
                'DatabaseCannotCreateBecauseDatabaseError'
            );
    }
};
=======
        console.error(`cannot get user with token: ${token} (knex error: ${error})`);
        return false;
    }
<<<<<<< HEAD
}
>>>>>>> 241bdeb (api-authentication: add new migrations, auth middleware to endpoints and passport strategy)
=======
};
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)

const cleanExpiredApiTokens = async () => {
    try {
        const rowsToDelete = await knex(tableName)
        console.log("TRY")
        console.log(rowsToDelete)
        console.log(rowsToDelete.values)
        console.log("BYE")
        for (var row in rowsToDelete) {
            deleteRecord(knex, tableName, row['id'])
        }
    } catch (error) {
        console.log("shits weird")
        throw new TrError(
            `Cannot cleanup expired tokens from table ${tableName} (knex error: ${error})`,
            'DatabaseCleanupDatabaseApiTokensTokenBecauseDatabaseError'
        );
    }
};

export default {
    getOrCreate,
    update,
    getById,
    getUserByToken,
<<<<<<< HEAD
    exists: exists.bind(null, knex, tableName),
    delete: deleteRecord.bind(null, knex, tableName)
=======
    match,
    exists: exists.bind(null, knex, tableName),
    read,
<<<<<<< HEAD
<<<<<<< HEAD
    delete: deleteRecord.bind(null, knex, tableName),
>>>>>>> 241bdeb (api-authentication: add new migrations, auth middleware to endpoints and passport strategy)
=======
    delete: deleteRecord.bind(null, knex, tableName)
>>>>>>> 8fe263c (Fixed linting of transition-backend and chaire-lib-backend with yarn format)
=======
    delete: deleteRecord.bind(null, knex, tableName),
    cleanExpiredApiTokens,
>>>>>>> 4416698 (modify parser)
};
