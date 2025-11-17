import App from "../App";
import Chat from "../components/Chat";
import { describe, test, expect, beforeEach, beforeAll, afterAll, afterEach, vi} from "vitest";
import { render, screen, fireEvent} from "@testing-library/react";
import { createRoutesStub, MemoryRouter, Routes, Route, Outlet, BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import store from "@/store";
import { Provider } from "react-redux";
import initializeDatabase from "@/lib/initializeDatabase";

describe('the chat route', () => {
    const db = new PGlite({
        dataDir: 'idb://chat',
        relaxedDurability: true,
    })
    initializeDatabase(db)
    const Stub = createRoutesStub([
        {
            path: "/",
            Component: Chat,
        },
        {
            path: "/:id",
            Component: Chat,
        }
      ])
    beforeEach(async ()=> {
        render( 
        <PGliteProvider db={db} >
            <Provider store={store}>
                <Stub initialEntries={["/"]} /> 
            </Provider>
        </PGliteProvider>
        )
    })
    test('user messages are saved', async () => {
        const user = userEvent.setup()
        screen.debug()
        await screen.getByRole('textarea').fill('Hello')
        await user.getByRole('button', {name: 'Send'}).click()
        expect(screen.getAllByText('Hello')).toHaveLength(2)
    })
})