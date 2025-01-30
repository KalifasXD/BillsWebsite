document.addEventListener("DOMContentLoaded", () => {
    const light_mode_color = 0xF4D1C8;
    const dark_mode_color = 0x292F3A;
    const dark_mode_background_color = 0x161B22;
    const light_mode_background_color = 0xF4E3D7;
  
    let initializedVantaEffects = ['#home', '#experience', '#education-languages', '#contact']
    let vantaEffects = []
    let vEffect;
    spawn_vanta_effects(light_mode_color, light_mode_background_color);
  
    document.getElementById("darkModeToggle").addEventListener("click", () => {
      vantaEffects.forEach(vantaEffect => {
          vantaEffect.destroy();
      })
      if(document.getElementById("darkModeToggle").checked)
        spawn_vanta_effects(dark_mode_color, dark_mode_background_color); 
      else
        spawn_vanta_effects(light_mode_color, light_mode_background_color);
    });
  
    function spawn_vanta_effects(newColor, newBackGroundColor){
      vantaEffects = []; // Clear the array
      initializedVantaEffects.forEach(id => {
        vEffect = VANTA.NET({
          el: id,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: newColor,
          backgroundColor: newBackGroundColor,
          points: 9.00,
          maxDistance: 20.00,
          spacing: 20.00,
          showDots: false
        });
        vantaEffects.push(vEffect);
      })
    }
});