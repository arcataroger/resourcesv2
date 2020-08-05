import "./index.css";

import React, {
    useState,
    useEffect
} from "react";
import ReactDOM from "react-dom";
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import JSONPretty from 'react-json-pretty';
import fileSize from "filesize";

JavascriptTimeAgo.addLocale(en);

function Resources() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`https://reactor.fieldmuseum.dev/apiv2/resources`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (data) {

        return (
            <div>
                <h1>Resources</h1>
                {
                    data.resources.map((resource) =>
                        <div key={resource.nid}>
                            <h2>{resource.title}</h2>
                            <ul>
                                <li>NID: {resource.nid}</li>
                                <li>Last modified: <ReactTimeAgo date={resource.timestamp * 1000}/></li>
                                <li>Files:
                                    <ul>
                                        {resource.files && resource.files.map((file) =>
                                            <li key={file.fid}>
                                                <a href={file.url}>{file.language}</a> {file.filemime} {fileSize(file.filesize, {base: 10})}
                                            </li>
                                        )}
                                    </ul>
                                </li>
                                <li>Taxonomies:
                                    <ul>
                                        {resource.taxonomies && resource.taxonomies.map((taxon) =>
                                            taxon.vid >=1 &&
                                            <li key={taxon.vid}>
                                                {taxon.name}
                                                <JSONPretty data={taxon} />
                                            </li>
                                        )}
                                    </ul>
                                </li>
                                {/*<li><JSONPretty key={resource.nid} data={resource}/></li>*/}
                            </ul>
                        </div>
                    )}
            </div>
        );
    } else {
        return null;
    }
}

function lookupTaxonomies(taxon, legend) {
    const lookup = legend.find(({vid}) => vid === taxon.vid);
    return lookup || null;
}

function App() {
    return <Resources/>;
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);
