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
    
    // Calculate the final rotation based on result
    // Use a large number of rotations (1800deg = 5 full spins) plus the final position
    const currentRotation = coin.style.transform ? 
      parseFloat(coin.style.transform.replace(/[^\d.-]/g, '')) : 0;
    
    let finalRotation;
    if (data.coin_result === 'heads') {
      // Land on heads (0deg or any multiple of 360)
      finalRotation = currentRotation + 1800; // 5 full spins
      // Make sure it ends at 0 or 360
      finalRotation = Math.floor(finalRotation / 360) * 360;
    } else {
      // Land on tails (180deg)
      finalRotation = currentRotation + 1800 + 180; // 5 full spins + 180
      // Make sure it ends at 180
      finalRotation = Math.floor((finalRotation - 180) / 360) * 360 + 180;
    }
    
    // Apply the rotation with animation
    coin.style.transition = 'transform 1s ease-in-out';
    coin.style.transform = `rotateY(${finalRotation}deg)`;
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
