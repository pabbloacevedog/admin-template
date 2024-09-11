import { startTestServer, stopTestServer } from '../../testServer';
import models from '../models';
import fetch from 'node-fetch';

let url;

describe('Auth Resolvers', () => {
    beforeAll(async () => {
        const serverInfo = await startTestServer();
        url = serverInfo.url;
        await models.sequelize.sync({ force: true });
        // Primero, crea los roles y las acciones
        const role = await models.Role.create({ name: 'User', description: 'Default role' });
        const action = await models.Action.create({ name: 'Read', description: 'Permit read' });

        // Luego, crea la relación entre el role y la accion usando el modelo RoleAction
        await models.RoleAction.create({
            role_id: role.role_id,
            action_id: action.action_id
        });
    }, 1000); // Aumentar tiempo de espera a 10 segundos

    afterAll(async () => {
        await stopTestServer();
        await models.sequelize.close();
    });

    it('should register a new user', async () => {
        const REGISTER = `
            mutation {
                register(email: "test@example.com", password: "password123") {
                    email
                    message
                }
            }
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: REGISTER })
        });
        const res = await response.json();

        expect(res.errors).toBeUndefined();
        expect(res.data.register.email).toBe('test@example.com');
    });

    it('should login a user', async () => {
        const LOGIN = `
            query {
                login(email: "test@example.com", password: "password123") {
                    token
                }
            }
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: LOGIN })
        });
        const res = await response.json();

        // Verifica que no haya errores en la respuesta
        expect(res.errors).toBeUndefined();

        // Verifica que el token se haya generado
        expect(res.data.login.token).toBeDefined();
    });

});
