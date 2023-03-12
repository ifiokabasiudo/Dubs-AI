import Head from "next/head";
import Script from 'next/script';
import { useState, useEffect } from "react";

export default function Home() {
  const [firstQuestion, nextQuestion] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setLoading] = useState(false);

  
  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
     
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({ question: firstQuestion }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);

      const myDiv1 = document.querySelector("#my-div");
      myDiv1.innerText = data.result.toString();

      MathJax.typesetPromise();

      nextQuestion("");
      setLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  }
  
  return (
    <div id="root">
      <Head>
          <title>Dubs AI</title>
          <link href="book-open-solid.svg" rel="icon"/>
      </Head>

      <Script src="https://polyfill.io/v3/polyfill.min.js?features=es6"/>
          <Script id="MathJax-script" defer async src="https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js"/>
          <Script src="https://kit.fontawesome.com/f6d4afe053.js" crossorigin="anonymous"/>

          <Script>
            {`
              MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ["\\(", "\\)"]],
                  processEscapes: true,
                }
              }
            `}
          </Script>


        <main>
          <div className="container-fluid m-0 p-0 text-center container-edit">
            <div className="row justify-content-center">
            <div className="col-lg-4 col-md-12 col-sm-12 bg">
                  <div className="font-awesome-icon">
                    <i className="fa-solid fa-book-open fa-2x book"></i>
                    <h6 className="icon-text">Dubs AI</h6>
                  </div>
                  <div>
                    <h3 className="dubs">It's a New Era</h3>
                    <p>Let's think for you</p>
                    <div className="tips tooltip">Tips <i className="fa-solid fa-message tip-img"></i>
                      <div className="tip-container">
                        <span className="tooltiptext">
                          <ul>
                            <li>When dealing with currency, remove the currency notation i.e $.</li>
                            <li>If it gives you answers in a way you can't understand, just reload the page and try again.</li>
                            <li>Cannot display images. And therefore will be displayed as "misplaced &".</li>
                          </ul>
                        </span>
                      </div>
                    </div>            
                    <form onSubmit={onSubmit}>
                      <input
                        className="form-control ask-edit"
                        type="text"
                        name="question"
                        placeholder="Ask away!"
                        value={firstQuestion}
                        onChange={(e) => nextQuestion(e.target.value)}
                      />
                      <input type="submit" value="Send" className="btn btn-outline-light btn-edit"/>
                      {isLoading && <div className="loader">Processing...</div>}
                    </form>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12 bg2">
                  <div className="answers-bg">
                    <div id="my-div" className="ans"></div>
                  </div>
                </div>
            </div>
          </div>
        </main>
    </div>
  );
}
