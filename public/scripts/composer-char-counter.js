$(function() {
  wordCounter();
});

const wordCounter = function() {
  const $inputfield = $('#tweet-text');
  $inputfield.on('input', function() {
    const $counter = 140 - $('textarea', this).val().length;
    // if the content is too long, change the color to red
    // else change the color to default;
    if ($counter < 0) {
      $('.counter', this).css('color', 'red');
    } else {
      $('.counter', this).css('color', '');
    }
    $('.counter', this).text($counter);
  });
};
