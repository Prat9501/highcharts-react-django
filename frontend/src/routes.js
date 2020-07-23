import React from 'react';
import Dashboard from './pages/Dashboard';
import Reports from './pages/reports'
import {BrowserRouter, Switch, Route} from 'react-router-dom';


export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Dashboard}/>
                <Route path='/reports' component={Reports} />
            </Switch>
        </BrowserRouter>
    )
}