import "./index.css";

import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import fileSize from "filesize";
import striptags from "striptags"; // For getting rid of pesky span, font, etc. tags
import fallbackData from "./data/1-22-2021.json";

// Relative time, like "Updated 5 months ago"
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";





JavascriptTimeAgo.addDefaultLocale(en);
const allowedTags = ['b','strong','p','i','em','br','a'];

function Resources() {
    const [data, setData] = useState(fallbackData);

    useEffect(() => {
        fetch(`https://tfm-apiv2-field-museum1.pantheonsite.io/apiv2/resources`)
            .then((res) => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (data) {
        const legend = data.taxonomy_legend;


        return (
            <div>
                <h1>Resources</h1>
                {data.resources.map((resource) => {

                    const milliseconds = resource.timestamp * 1000;
                    const dateString = new Date(milliseconds).toLocaleDateString();
                    const strippedHTML = striptags(resource.body, allowedTags);
                    return (
                        <div key={resource.nid}>
                            <h2>{resource.title}</h2>
                            <div className="body" dangerouslySetInnerHTML={{__html: strippedHTML }}/>
                            <ul>
                                <li>NID: <a href={"http://localhost/node/" + resource.nid + "/edit"}>{resource.nid}</a>
                                </li>
                                <li>
                                    Last modified: {dateString} (<ReactTimeAgo
                                    date={milliseconds}/>)
                                </li>
                                <li>
                                    Links:
                                    <ul>
                                        {resource.links &&
                                        resource.links.map((link) => (
                                            <li key={btoa(link.url)}>
                                                <a href={link.url}
                                                   target={link.attributes.target || '_self'}>{link.title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    Files:
                                    <ul>
                                        {resource.files &&
                                        resource.files.map((file) => (
                                            <li key={file.fid}>
                                                <a href={file.url}>{file.language}</a> {file.filemime}{" "}
                                                {fileSize(file.filesize, {base: 10})}
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li>
                                    Taxonomies:
                                    {resource.taxonomies &&
                                    resource.taxonomies.map((taxon) => {
                                        return (
                                            taxon.vid > 0 && (
                                                <ul key={taxon.vid}>
                                                    <li>{taxon.vid}: {legend[taxon.vid].machine_name} </li>
                                                    <ul>
                                                        {taxon.terms.map((tid) => {
                                                            const termData = legend[taxon.vid].terms[tid];
                                                            return (
                                                                <li key={tid}>{tid}: {termData && termData.name}</li>
                                                            );
                                                        })}
                                                    </ul>
                                                </ul>
                                            )
                                        );
                                    })}
                                </li>
                            </ul>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return null;
    }
}

function App() {
    return <Resources/>;
}

ReactDOM.render(<App/>, document.getElementById("root"));
