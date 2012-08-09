// rudimentary box2d wrapper by sole / http://soledadpenades.com
// still very much under construction, please handle with care
var B2D = B2D || { REVISION: 1 };

B2D.World = function( gravity, sleep ) {
	
	var world;

	gravity = gravity || new Box2D.Common.Math.b2Vec2( 0, 300 );
	sleep = sleep || true;
	
	world = new Box2D.Dynamics.b2World( gravity, sleep );
	
	this.step = function( dt, velocityIterations, positionIterations ) {

		world.Step( dt, velocityIterations, positionIterations );

	}
	
	this.setDebugDraw = function( debugDraw ) {
	
		world.SetDebugDraw( debugDraw._debugDraw );

	}
	
	this.drawDebugData = function() {
	
		world.DrawDebugData();

	}
	
	this.clearForces = function() {
	
		world.ClearForces();

	}
	
	this.createBody = function( bodyDef ) {
		
		return new B2D.Body( world.CreateBody( bodyDef._bodyDef ) );
		
	}

	this.createJoint = function( jointDef ) {

		return new B2D.Joint( world.CreateJoint( jointDef._def ) );

	}

	this._world = world; // 'hack'
	
}


B2D.Body = function( _body ) {
	var body = _body;
	
	this.createFixture = function( fixtureDef ) {

		return new B2D.Fixture( body.CreateFixture( fixtureDef._fixtureDef ) );
		
	}

	this.applyImpulse = function( vector, center ) {

		_body.ApplyImpulse( vector, center );

	}

	this.getWorldCenter = function() {

		return _body.GetWorldCenter();

	}
	
	this._body = body; // 'hack'
}

B2D.BodyDef = function() {
	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	
	this.__defineGetter__('position', function() {
		return bodyDef.position;
	});
	
	this.__defineSetter__('type', function( value ) {
		bodyDef.type = value;
	});
	
	this._bodyDef = bodyDef; // 'hack'
}

B2D.BodyDef.DYNAMIC = Box2D.Dynamics.b2Body.b2_dynamicBody;
B2D.BodyDef.STATIC = Box2D.Dynamics.b2Body.b2_staticBody;



B2D.DebugDraw = function() {
	
	var debugDraw,
		canvas = null;
	
	debugDraw = new Box2D.Dynamics.b2DebugDraw();
	
	this.__defineGetter__('canvas', function() {
		return canvas;
	});
	
	this.__defineSetter__('canvas', function( value ) {
		canvas = value;
		debugDraw.SetSprite( canvas.getContext( '2d' ) );
	});
	
	this.__defineSetter__('scale', function( value ) {
		debugDraw.SetDrawScale( value );
	});

	this.__defineSetter__('fillAlpha', function( value ) {
		debugDraw.SetFillAlpha( value );
	});
	
	this.__defineSetter__('lineThickness', function( value ) {
		debugDraw.SetLineThickness( value );
	});
	
	this.__defineSetter__('flags', function( value ) {
		debugDraw.SetFlags( value );
	});
	
	this._debugDraw = debugDraw; // 'hack'
}

B2D.DebugDraw.AABB = Box2D.Dynamics.b2DebugDraw.e_aabbBit;
B2D.DebugDraw.CENTER_OF_MASS = Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit;
B2D.DebugDraw.CONTROLLER = Box2D.Dynamics.b2DebugDraw.e_controllerBit;
B2D.DebugDraw.JOINT = Box2D.Dynamics.b2DebugDraw.e_jointBit;
B2D.DebugDraw.PAIR = Box2D.Dynamics.b2DebugDraw.e_pairBit;
B2D.DebugDraw.SHAPE = Box2D.Dynamics.b2DebugDraw.e_shapeBit;


B2D.Fixture = function( f ) {
	var fixture = f;
	
	this._fixture = f;
}

B2D.FixtureDef = function() {

	var fixtureDef = new Box2D.Dynamics.b2FixtureDef(),
		shape = null;
	
	this.__defineSetter__('shape', function( value ) {
		shape = value;
		fixtureDef.shape = value._shape;
	});
	
	
	this.__defineGetter__('shape', function() {
		return shape; 
	});
	
	this._fixtureDef = fixtureDef; // 'hack'
}


B2D.PolygonShape = function() {
	
	var shape = new Box2D.Collision.Shapes.b2PolygonShape();
	
	this.setAsBox = function( w, h ) {
	
		shape.SetAsBox( w, h );

	}
	
	this._shape = shape; // 'hack'

}

B2D.CircleShape = function( radius ) {

	var shape = new Box2D.Collision.Shapes.b2CircleShape( radius ),
		radius = radius;
	
	this.__defineSetter__('radius', function( value ) {
		shape.SetRadius( value );
	});

	this._shape = shape; // 'hack'

}


B2D.Joint = function( _joint ) {

	var joint = _joint;

	this._joint = joint; // 'hack'
}

B2D.JointDef = function( ) {
}

B2D.RevoluteJointDef = function( ) {

	var def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();

	this._def = def; // 'hack'

}

B2D.DistanceJointDef = function( ) {

	var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();

	this._def = def; // 'hack'

}

B2D.Shortcuts = {};
B2D.Shortcuts.createBody = function( params ) {
	var x = params.x || 0,
		y = params.y || 0,
		shapeClass = params.shape || B2D.PolygonShape,
		width = params.width || 100,
		height = params.height || 100,
		radius = params.radius || 10,
		type = params.type !== undefined ? params.type : B2D.BodyDef.DYNAMIC,
		world = params.world,
		fixtureDef = new B2D.FixtureDef(),
		shape = new shapeClass(),
		body,
		bodyDef;

	fixtureDef._fixtureDef.density = params.density || 1.0;

	if( shapeClass == B2D.PolygonShape ) {
		shape.setAsBox( width, height );
	} else if( shapeClass == B2D.CircleShape ) {
		shape.radius = radius;
	}

	fixtureDef.shape = shape;

	bodyDef = new B2D.BodyDef();
	bodyDef.position.x = x;
	bodyDef.position.y = y;
	bodyDef.type = type;

	body = world.createBody( bodyDef );
	body.createFixture( fixtureDef );

	return body;

}

B2D.Shortcuts.createJoint = function( params ) {
	var world = params.world,
		body1 = params.body1,
		body2 = params.body2,
		jointClass = params.class || B2D.RevoluteJointDef,
		def = new jointClass();

	if( jointClass == B2D.RevoluteJointDef ) {

		var anchor;

		if( params.anchor !== undefined ) {

			anchor = params.anchor;

		} else {

			var c1 = body1.getWorldCenter(),
				c2 = body2.getWorldCenter(),
				anchor = new Box2D.Common.Math.b2Vec2( (c1.x + c2.x) / 2, (c1.y + c2.y) / 2 );

		}
		
		def._def.Initialize( body1._body, body2._body, anchor );

	} else if( jointClass == B2D.DistanceJointDef ) {

		var anchor1 = params.anchor1 !== undefined ? params.anchor1 : body1.getWorldCenter(),
			anchor2 = params.anchor2 !== undefined ? params.anchor2 : body2.getWorldCenter();

		def._def.Initialize( body1._body, body2._body, anchor1, anchor2 );

	}

	return world.createJoint( def );
}
