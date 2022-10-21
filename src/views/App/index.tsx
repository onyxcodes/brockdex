import React from "react";
import { useSelector } from "react-redux";
import { ListState } from "features/pokeapi/list";
import { AppState } from "store";

import ActionBar from "components/commons/ActionBar";
import ListView from "views/ListView";

import PokeModal from "components/custom/PokeModal";
import PokeSearch from 'components/custom/PokeSearch';
import Button from 'components/commons/Button';
import { NotificationArea, Notifier } from 'utils/notifications';

import logger from 'utils/logger';

import 'styles/index.scss';
import PokeNotification from 'components/custom/PokeNotification';

const App = () => {
    // TODO: Move this somewhere more appropriate
    // Updates total count stored in localStorage with given total, if differs
    const updateTotal = (total: number) => {
        let storedTotal = localStorage.getItem("total") ? Number(localStorage.getItem("total")) : null;
        if (!total || isNaN(total)) {
            logger.debug({total}, 'updateTotal - Given total is not a number or 0');
        } else if (
            storedTotal && // total already stored
            storedTotal !== total // update only when different
        ) {
            localStorage.setItem("total", total.toString());
        } else if (!storedTotal) { // in case was not stored yet
            localStorage.setItem("total", total.toString())
        } // else // skip update cause not needed
    }

    const responseTotal = useSelector<AppState, ListState["total"]>(s => s.list.total);

    const notifications = useSelector<AppState, Notifier.NotificationObject[]>( s => s.notifications );

    // Updates with total number of pokemon, only once when list first loads
    React.useEffect(() => updateTotal(responseTotal), [responseTotal]);

    return <div id="app">
        <div id='modal-area'></div>
        <div id='sidebar-area'></div>
        <NotificationArea
            notifications={notifications}
            options={{
                element: <PokeNotification/>
            }}
        />
        <main>
            <ActionBar type='primary' position="top" items={[
                {
                    item: <PokeSearch/>,
                    title: 'Search',
                    position: "right",
                    key: 'searchbar',
                    alt: <Button title='Search' shape='circle' iconName='search'/>
                },
                { item: <span>BrockDex</span>, position: "center", key: 'app-logo' },
                // TODO
                // { item: <button>Favs</button>, position: "right", key: 'favorite-btn' }
            ]} />
            <ListView/>
            <PokeModal/>
        </main>
    </div>
}

export default App;