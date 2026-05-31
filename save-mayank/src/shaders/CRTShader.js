import * as Phaser from 'phaser';

export const CRTShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;
    
    // Curvature
    vec2 dc = abs(0.5 - uv);
    dc *= dc;
    uv.x -= 0.5;
    uv.x *= 1.0 + (dc.y * (0.03));
    uv.x += 0.5;
    uv.y -= 0.5;
    uv.y *= 1.0 + (dc.x * (0.04));
    uv.y += 0.5;

    if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec4 color = texture2D(uMainSampler, uv);
        
        // Scanlines
        float scanline = sin(uv.y * 800.0) * 0.04;
        color -= scanline;
        
        // Flicker
        color *= 0.98 + 0.02 * sin(110.0 * uTime);
        
        // Vignette
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = pow(16.0 * vignette, 0.1);
        color *= vignette;
        
        gl_FragColor = color;
    }
}
`;

export default class CRTPipeline extends Phaser.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader: CRTShader
        });
    }

    onPreRender() {
        this.set1f('uTime', this.game.loop.time / 1000);
    }
}
