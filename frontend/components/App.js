import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */navigate('/'); }
  const redirectToArticles = () => { /* ✨ implement */navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage('Goodbye!')
    redirectToLogin();
  }

  // const login = ({ username, password }) => {
  //   // ✨ implement
  //   // We should flush the message state, turn on the spinner
  //   // and launch a request to the proper endpoint.
  //   // On success, we should set the token to local storage in a 'token' key,
  //   // put the server success message in its proper state, and redirect
  //   // to the Articles screen. Don't forget to turn off the spinner!
    
  // }
  const login = async ({ username, password }) => {
    // Flush the message state and turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    
    try {
      // Make a POST request to the login endpoint
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const { token, message } = await response.json();
        
        // Store the token in local storage
        localStorage.setItem('token', token);
        
        // Set the success message
        setMessage(message);
        
        // Redirect to the Articles screen
        redirectToArticles();
      } else {
        // If the server responded with an error status, display the error message
        const { message } = await response.json();
        setMessage(message);
      }
    } catch (error) {
      // Handle network errors
      setMessage('Network error: ' + error.message);
    } finally {
      // Always turn off the spinner, whether the request succeeded or failed
      setSpinnerOn(false);
    }
  };
  
  // const getArticles = () => {
  //   // ✨ implement
  //   // We should flush the message state, turn on the spinner
  //   // and launch an authenticated request to the proper endpoint.
  //   // On success, we should set the articles in their proper state and
  //   // put the server success message in its proper state.
  //   // If something goes wrong, check the status of the response:
  //   // if it's a 401 the token might have gone bad, and we should redirect to login.
  //   // Don't forget to turn off the spinner!
  // }
  const getArticles = () => {
    
    setMessage('');
    setSpinnerOn(true);
    fetch(articlesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the token from local storage in the Authorization header
        'Authorization': `${localStorage.getItem('token')}`
      },
    })
      .then(response => {
        // If the response was a 401 (Unauthorized), the token is invalid
        if (response.status === 401) {
          redirectToLogin();
        } else {
          return response.json();
        }
      })
      .then(data => {
        // Turn off the spinner
        setSpinnerOn(false);
          setArticles(data.articles);
          // Set a success message
          setMessage(data.message);
        
      })
      .catch(error => {
        // Handle any other errors
        setSpinnerOn(false);
        setMessage(`Error: ${error.message}`);
      });
  }
  
  // // const postArticle = article => {
  // //   // ✨ implement
  
  // //   // The flow is very similar to the `getArticles` function.
  // //   // You'll know what to do! Use log statements or breakpoints
  // //   // to inspect the response from the server.
    
  // // }
  const postArticle = article => {
    // Clear any existing messages
    setMessage('');
  
    // Turn on the spinner
    setSpinnerOn(true);
  
    // Make a POST request to the articles endpoint
    fetch(articlesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the token from local storage in the Authorization header
        'Authorization': `${localStorage.getItem('token')}`
      },
      body: JSON.stringify(article),
    })
      .then(response => {
        // If the response was a 401 (Unauthorized), the token is invalid
        if (response.status === 401) {
          redirectToLogin();
        } else {
          return response.json();
        }
      })
      .then(data => {
        // Turn off the spinner
        setSpinnerOn(false);
          // If there was data in the response, add the new article to the articles state
          setArticles([...articles, data.article]);
  
          // Set a success message
          setMessage(data.message);
        
      })
      .catch(error => {
        // Handle any other errors
        setSpinnerOn(false);
        setMessage(`Error: ${error.message}`);
      });
  }
  
  
  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
      // Clear any existing messages
      console.log("edited what were",article)
  setMessage('');
  // Turn on the spinner
  setSpinnerOn(true);
  // Make a PUT request to the articles endpoint
  fetch(`${articlesUrl}/${article_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Include the token from local storage in the Authorization header
      'Authorization': `${localStorage.getItem('token')}`
    },
    body: JSON.stringify(article),
  })
    .then(response => {
      // If the response was a 401 (Unauthorized), the token is invalid
      if (response.status === 401) {
        redirectToLogin();
      } else {
        return response.json();
      }
    })
    .then(data => {
      // Turn off the spinner
      setSpinnerOn(false);
        // If there was data in the response, update the article in the articles state
        console.log(data)
        setArticles(data.articles);
        // Set a success message
        setMessage(data.message);
    
    })
    .catch(error => {
      // Handle any other errors
      setSpinnerOn(false);
      setMessage(`Error: ${error.message}`);
    });
  }

  const deleteArticle = article_id => {
    // ✨ implement
      // Clear any existing messages
  setMessage('');

  // Turn on the spinner
  setSpinnerOn(true);

  // Make a DELETE request to the articles endpoint
  fetch(`${articlesUrl}/${article_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Include the token from local storage in the Authorization header
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  })
    .then(response => {
      // If the response was a 401 (Unauthorized), the token is invalid
      if (response.status === 401) {
        redirectToLogin();
      } else {
        return response.json();
      }
    })
    .then(() => {
      // Turn off the spinner
      setSpinnerOn(false);

      // If the request was successful, remove the article from the articles state
      setArticles(prevArticles => prevArticles.filter(a => a.id !== article_id));

      // Set a success message
      setMessage('Article deleted successfully');
    })
    .catch(error => {
      // Handle any other errors
      setSpinnerOn(false);
      setMessage(`Error: ${error.message}`);
    });
  }
  

    console.log("looking for articles:",articles)
  //const currentArticle = articles.find(article => article.article_id === currentArticleId);
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle}
               updateArticle={updateArticle}
               setCurrentArticleId={setCurrentArticleId}
               currentArticleId={currentArticleId}
               currentArticle={articles.find(article => article.article_id === currentArticleId)}
               />
              <Articles articles={articles} 
                        getArticles={getArticles}
                        updateArticle={updateArticle} 
                        deleteArticle={deleteArticle} 
                        setCurrentArticleId={setCurrentArticleId} 
                        currentArticleId={currentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
