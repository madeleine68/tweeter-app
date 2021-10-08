
  /*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//// Registering event listener functions once the HTML is loaded
$(function() {
  tweetSubmit();
  writeToggle();
});

//// HTML Insertion
const createTweetElement = function(tweetObj) {
  const userAvatar = $('<img>').addClass('tweet-avatar').attr('src', tweetObj.user.avatars);
  const userName = $('<span>').addClass('tweet-name').text(tweetObj.user.name);
  const headerDivLeft = $('<div>').addClass('header-left').append(userAvatar, userName);
  const userHandle = $('<span>').addClass('tweet-id').text(tweetObj.user.handle);
  const headerDivRight = $('<div>').addClass('header-right').append(userHandle);
  const tweetHeader = $('<header>').addClass('old-tweet').append(headerDivLeft, headerDivRight);

  const userTweet = $('<p>').addClass('old-tweet').append(document.createTextNode(tweetObj.content.text));

  const tweetDate = $('<span>').addClass('tweet-date').text(timeago.format(tweetObj.created_at));
  const footerDivLeft = $('<div>').addClass('footer-left').append(tweetDate);
  const footerDivRight = $('<div>').addClass('footer-right').html(`
    <a href=""><i class="fas fa-flag"></i></a>
    <a href=""><i class="fas fa-retweet"></i></a>
    <a href=""><i class="fas fa-heart"></i></a>
  `);
  const tweetFooter = $('<footer>').addClass('old-tweet').append(footerDivLeft, footerDivRight);
  const tweetArticle = $('<article>').addClass('old-tweet').append(tweetHeader, userTweet, tweetFooter);
  return tweetArticle;
};

//// Displaying existing tweets
const renderTweets = function(tweets) {
  const $tweetContainer = $('.tweets-container')
  // Empting the "tweets-container" element
  $('.tweets-container').empty();
    // loops through tweets
    for (const tweet of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet)
      $tweetContainer.prepend($tweet);
  }
};

//// Tweet Submission
const tweetSubmit = function() {
  $('#tweet-text').submit(function(event) {
    event.preventDefault();
    const $tweetText = $('#tweet-text :input').val();
    // Error message will be displayed upon an invalid submission
    if ($tweetText.length < 1) {
      // Error message will not go away if the same error is repeated upon submission
      if ($('.submit-error').text() !== 'Please tweet something') {
        $('.submit-error').hide().text('');
      }
      return $('.submit-error').text('Please tweet something').slideDown(750);
    }
    if ($tweetText.length > 140) {
      if ($('.submit-error').text() !== 'Tweet too long') {
        $('.submit-error').hide().text('');
      }
      return $('.submit-error').text('Tweet too long').slideDown(750);
    }
    // Any previous error message will go away upon a valid submission
    $('.submit-error').hide();
    // Converts message to JSON format
    const $data = $('#tweet-text :input').serialize();
    // POST submission
    $.post('/tweets', $data)
      .done(function() {
        // Empting the textarea input field
        $('#tweet-text textarea').val('');
        $.get('/tweets')
          .done(function(data) {
            // Word counter resets
            $('.new-tweet .counter').text(140);
            // Updates the list of tweets
            renderTweets(data);
          });
      });
  });
};

//// Loads tweets from database and displays them
const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data);
  });
};

loadTweets();

//// The "Write a new tweet" button on the nav bar
const writeToggle = function() {
  $('.write-tweet').click(function() {
    $('section.new-tweet').slideToggle('slow');
    $('.new-tweet textarea').focus();
  });
};

