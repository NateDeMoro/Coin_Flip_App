async function flip(guess) {
  const headsBtn = document.getElementById('heads-btn');
  const tailsBtn = document.getElementById('tails-btn');
  const resultEl = document.getElementById('result');
  const coin = document.getElementById('coin');
  
  try {
    // Disable buttons during flip
    headsBtn.disabled = true;
    tailsBtn.disabled = true;
    
    // Clear previous result
    resultEl.innerText = '';
    resultEl.className = '';
    
    // Fetch the result first
    const res = await fetch('/flip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess })
    });

    const data = await res.json();
    
    // Set the coin to the correct final position BEFORE animation
    if (data.coin_result === 'heads') {
      coin.style.transform = 'rotateY(0deg)';
    } else {
      coin.style.transform = 'rotateY(180deg)';
    }
    
    // Start coin flip animation
    coin.classList.add('flipping');
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Stop animation
    coin.classList.remove('flipping');
    
    // Wait a bit before showing text result
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Determine if guess was correct
    const isCorrect = data.your_guess === data.coin_result;
    
    // Display result with color
    resultEl.innerText = `You guessed ${data.your_guess}. Coin was ${data.coin_result}.`;
    resultEl.className = isCorrect ? 'correct' : 'incorrect';
  } catch (error) {
    console.error('Error flipping coin:', error);
    resultEl.innerText = 'Error! Please try again.';
    resultEl.className = 'incorrect';
  } finally {
    // Always re-enable buttons
    headsBtn.disabled = false;
    tailsBtn.disabled = false;
  }
}
