// Pisca o sprite em branco quando leva dano.
shader_type canvas_item;

uniform float clarao : hint_range(0.0, 1.0) = 0.0;

void fragment() {
	vec4 cor = texture(TEXTURE, UV);
	COLOR = vec4(mix(cor.rgb, vec3(1.0), clarao), cor.a);
}
