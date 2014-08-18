/**
 * A classe <code>Angle</code> representa um ângulo, em graus ou em radianos, no intervalo [-π,+π[ ou [0,+2π[.
 * @author Ivan Ramos Pagnossin
 * @version 1.0 (2011.01.24)
 */
var Angle = function(angle)
{
	//--------------------------------
	// Membros públicos (interface).
	//--------------------------------
	
	/**
	 * Domínio [-π,+π].
	 * @see domain
	 */
	this.MINUS_PI_TO_PLUS_PI = "MINUS_PI_TO_PLUS_PI";
	
	/**
	 * Domínio [0,+2π].
	 * @see domain
	 */
	this.ZERO_TO_PLUS_2PI = "ZERO_TO_PLUS_2PI";
	//this._radians = 0; // O valor do ângulo, sempre dentro do domínio definido.
	//this._domain = ""; // O domínio do ângulo.
	
	/**
	 * Cria um objeto do tipo ângulo com valor padrão igual a zero e domínio [-π,+π[.
	 * Se for dado um argumento ao construtor, cria um novo ângulo com o mesmo valor e domínio do ângulo dado.
	 */
	if (angle)
	{
		this._radians = angle.radians;
		this._domain = angle.domain;
	}
	else
	{
		this._radians = 0;
		this._domain = MINUS_PI_TO_PLUS_PI;
	}
	
	/**
	 * O ângulo em radianos, no domínio definido por <code>domain</code>.
	 * @see domain
	 */
	this.radians = function(angle)
	{
		if(angle) this._radians = this.wrap(angle);
		else return this._radians;
	}
	
	/**
	 * O ângulo em graus, no domínio definido por <code>domain</code>.
	 * @see domain
	 */
	this.degrees = function(angle)
	{
		if(angle) this._radians = this.wrap(this.toRadians(angle));
		else return this.toDegrees(this._radians);
	}
	
	/**
	 * O domínio do ângulo.
	 * @see MINUS_PI_TO_PLUS_PI
	 * @see ZERO_TO_PLUS_2PI
	 */
	this.domain = function (name)
	{
		if(name){
			if (name == MINUS_PI_TO_PLUS_PI || name == ZERO_TO_PLUS_2PI)
			{
				this._domain = name;
				this._radians = this.wrap(this._radians);
			}
			else
			{
				console.log("Domínio desconhecido.");
			}
		}else return this._domain;
	}
	
	/**
	 * O seno do ângulo.
	 * @return	O seno do ângulo.
	 */
	this.sin = function()
	{
		return Math.sin(this._radians);
	}
	
	/**
	 * O cosseno do ângulo.
	 * @return	O cosseno do ângulo.
	 */
	this.cos = function()
	{
		return Math.cos(this._radians);
	}
	
	/**
	 * A tangente do ângulo.
	 * @return	A tangente do ângulo.
	 */
	this.tan = function()
	{
		return Math.tan(this._radians);
	}

	/**
	 * Retorna uma string que representa o ângulo.
	 * @return Representação do ângulo.
	 */
	/*public function toString () : String
	{
		return "Ângulo " + Math.round(degrees) + "º = " + radians.toFixed(1) + " rad no domínio " + (_domain == MINUS_PI_TO_PLUS_PI ? "[-π, +π[." : "[0, +2π[.");
	}*/
	
	/**
	 * Serializa o ângulo (numa string).
	 * @return	A serialização do ângulo.
	 * @see deserialize
	 */
	/*public function serialize () : String
	{
		return "_radians:" + _radians + "\t_domain:" + _domain;
	}*/
	
	/**
	 * Constrói o ângulo (Angle) a partir de uma serialização dada.
	 * @param	serialization	Serialização, criada pelo método <code>serialize()</code>.
	 * @see serialize
	 */
	/*public function deserialize (serialization:String) : void
	{
		var properties:Array = serialization.split("\t");
		var error:Error = new Error("Isto não é um ângulo (Angle).");
		
		try
		{
			if (properties.length != 2) throw error;
			
			var angle_definition:Array = properties[0].split(":");
			if (angle_definition.length != 2 || angle_definition[0] != "_radians") throw error;
			var angle_value:Number = Number(angle_definition[1]);
			if (isNaN(angle_value)) throw error;
			
			var domain_definition:Array = properties[1].split(":");
			if (domain_definition.length != 2 || domain_definition[0] != "_domain") throw error;
			var domain_value:String = domain_definition[1];
			
			_domain = domain_value;
			_radians = wrap(angle_value);
		}
		catch (e:Error)
		{
			throw e;
		}
	}*/
	
	//--------------------------------
	// Membros privados.
	//--------------------------------
	
	/*
	 * Mantém o ângulo no domínio.
	 */
	this.wrap = function(angle)
	{
		var ans;
		
		if (this._domain == MINUS_PI_TO_PLUS_PI) ans = angle - Math.floor((angle + Math.PI) / (2 * Math.PI)) * (2 * Math.PI);
		else ans = ans = angle - Math.floor(angle / (2 * Math.PI)) * (2 * Math.PI);
		
		return ans;
	}
	
	/*
	 * Converte radianos para graus.
	 */
	this.toDegrees = function(radians)
	{
		return radians * 180 / Math.PI;
	}
	
	/*
	 * Converte graus para radianos.
	 */
	this.toRadians = function(degrees)
	{
		return degrees * Math.PI / 180;
	}
}