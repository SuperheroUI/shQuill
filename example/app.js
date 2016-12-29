import React from 'react'
import ReactDOM from 'react-dom';
import ShQuill from '../bin/sh-quill'

class App extends React.Component {
    render() {
        return (
            <div className="example">
                <ShQuill/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));