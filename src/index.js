import "./index.css";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import fileSize from "filesize";
JavascriptTimeAgo.addLocale(en);

function Resources() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`https://reactor.fieldmuseum.dev/apiv2/resources`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (data) {
    const legend = data.taxonomy_legend;

    return (
      <div>
        <h1>Resources</h1>
        {data.resources.map((resource) => (
          <div key={resource.nid}>
            <h2>{resource.title}</h2>
            <ul>
              <li>NID: {resource.nid}</li>
              <li>
                Last modified: <ReactTimeAgo date={resource.timestamp * 1000} />
              </li>
              <li>
                Files:
                <ul>
                  {resource.files &&
                    resource.files.map((file) => (
                      <li key={file.fid}>
                        <a href={file.url}>{file.language}</a> {file.filemime}{" "}
                        {fileSize(file.filesize, { base: 10 })}
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
                          <li>{legend[taxon.vid].machine_name} </li>
                          <ul>
                            {taxon.terms.map((tid) => {
                              const termData = legend[taxon.vid].terms[tid];
                              return (
                                <li key={tid}>{termData && termData.name}</li>
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
        ))}
      </div>
    );
  } else {
    return null;
  }
}

function App() {
  return <Resources />;
}

ReactDOM.render(<App />, document.getElementById("root"));
