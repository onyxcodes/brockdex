import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ListState } from "features/pokeapi/list";
import { AppState } from "store";
import ListView from "views/ListView";
import _localStorage from 'utils/localStorage';
import PokeModal from "components/custom/PokeModal";
import PokeSearch from 'components/custom/PokeSearch';
import Pokeball from 'components/custom/Pokeball';
import {Button, ActionBar} from 'alenite-design';
import { nanoid } from '@reduxjs/toolkit';
require('alenite-design/lib/main.css')
import { NotificationArea, Notifier, createNotification } from 'utils/notifications';

import 'styles/index.scss';
import 'components/custom/PokeNotification/index.scss';

const App = () => {
    const dispatch = useDispatch();
    const notifications = useSelector<AppState, Notifier.NotificationObject[]>( s => s.notifications );

    const dataUsageConsent = _localStorage.getBoolean('dataUsageConsent');
    React.useEffect( () => {
        if ( dataUsageConsent == null ) {
            let promptNotification: Notifier.NewNotificationObject = {
                id: nanoid(),
                type: 'prompt',
                message: 'Can I steal your data?',
                clearable: false,
                actions: [
                    { label: 'Yes', callback: 'storeDataUsageConsent', payload: {
                        result: true
                    } },
                    { label: 'No', callback: 'storeDataUsageConsent', payload: {
                        result: false
                    } },
                ]
            }
            dispatch(createNotification(promptNotification));
        }
    }, [dataUsageConsent]);
    

    return <div id="app">
        <div id='modal-area'></div>
        <div id='sidebar-area'></div>
        <NotificationArea
            notifications={notifications}
            options={{
                iconMapping(type) {
                    let icon;
                    switch(type) {
                        case 'error':
                        case 'warning':
                            icon = <img className='floating-unown' src={require('assets/unown_esclamation_mark.png')}/>;
                        break;
                        // case 'debug':
                        //     icon = <i>D</i>;
                        // break;
                        case 'prompt':
                            icon = <img className='floating-unown' src={require('assets/unown_question_mark.png')}/>;
                        break;
                        case 'pending':
                            icon = <Pokeball animated={true}/>;
                        break;
                        // case 'info':
                        // default:
                        //     return <i>I</i>
                    }

                    return icon ? <div 
                        className='pokenotification-icon'>
                        {icon}
                    </div> : undefined;
                },
            }}
        />
        <main>
            <ActionBar type='primary' position="top" items={[
                {
                    item: <PokeSearch/>,
                    title: 'Search',
                    position: "right",
                    key: 'searchbar',
                    alt: <Button shape='default' iconName='search'/>
                    // alt: <Button title='Search' shape='circle' iconName='search'/>
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