import React from 'react'
import ReactDOM from 'react-dom';
import ShQuill from '../bin/sh-react-quill'

class App extends React.Component {
    render() {
        return (
            <div>
                <ShQuill id="react-quill-editor" />
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));