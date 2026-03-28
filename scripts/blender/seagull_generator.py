"""
╔══════════════════════════════════════════════════════════════════╗
║     SpaceHack 2026 — Seagull Mascot v3                          ║
║     Blender 3.6 / 4.x  —  Scripting tab → Run Script           ║
╠══════════════════════════════════════════════════════════════════╣
║  ANIMACIONES (6):                                               ║
║    Idle      — flotación suave en reposo                        ║
║    Greet     — saludo con ala, cabeza asiente                   ║
║    Alert     — se endereza de golpe, ojos abiertos              ║
║    Talk      — pico abre/cierra, cabeza anima                   ║
║    Worry     — cabizbaja, cuerpo encogido, tiembla              ║
║    Celebrate — salta, alas abiertas, fiesta                     ║
╠══════════════════════════════════════════════════════════════════╣
║  ITERACIÓN: mándame screenshot + "el pico muy corto" etc.       ║
║  y ajusto las coordenadas exactas.                              ║
╚══════════════════════════════════════════════════════════════════╝
"""

import bpy
import bmesh
import math
from mathutils import Vector

# ──────────────────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────────────────
# Cambia a ruta absoluta si el .blend no está guardado todavía:
#   OUTPUT_PATH = "C:/Users/ASUS/Desktop/seagull.glb"
OUTPUT_PATH = "//seagull.glb"
AUTO_EXPORT = True

D = math.degrees   # shorthand
R = math.radians


# ──────────────────────────────────────────────────────────────────
# ESCENA
# ──────────────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for bd in (bpy.data.meshes, bpy.data.armatures,
               bpy.data.materials, bpy.data.actions,
               bpy.data.curves):
        for item in list(bd):
            bd.remove(item)


# ──────────────────────────────────────────────────────────────────
# MATERIALES
# ──────────────────────────────────────────────────────────────────

def mat(name, rgb, rough=0.65):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value  = (*rgb, 1.0)
    b.inputs["Roughness"].default_value   = rough
    return m

def assign(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)

def subd(obj, n=1):
    mod = obj.modifiers.new("Subd", 'SUBSURF')
    mod.levels = n
    mod.render_levels = 2


# ──────────────────────────────────────────────────────────────────
# GEOMETRÍA — proporciones "dibujo animado"
#
#  La gaviota está de pie, mirando en +X
#  Centro del cuerpo en (0,0,0)
#  Cabeza arriba-adelante, bien prominente
#  Pico largo y curvado
# ──────────────────────────────────────────────────────────────────

def make_body(M):
    # Cuerpo ovalado, más alto que ancho para postura erguida
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=20, ring_count=14, radius=1.0, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = "Body"
    o.scale = (0.30, 0.22, 0.34)          # ← más alto (Z) que ancho
    bpy.ops.object.transform_apply(scale=True)
    subd(o, 1)
    assign(o, M["white"])
    return o

def make_head(M):
    # Cabeza grande y redonda — radio generoso para que se vea
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=18, ring_count=14, radius=0.24,
        location=(0.26, 0, 0.36))         # adelante y arriba del cuerpo
    o = bpy.context.active_object
    o.name = "Head"
    subd(o, 1)
    assign(o, M["white"])
    return o

def make_beak(M):
    """
    Pico curvado de gaviota — largo, aplanado, con gancho en la punta.
    Construido con bmesh para control total.
    """
    bm = bmesh.new()

    # Definimos el pico en su sistema local (apunta en +X, ligeramente hacia abajo)
    # Base (rect) → punta con gancho
    vdata = [
        # Base del pico (se une con la cabeza)
        ( 0.00,  0.052,  0.020),   # 0  sup-L
        ( 0.00, -0.052,  0.020),   # 1  sup-R
        ( 0.00,  0.040, -0.035),   # 2  inf-L
        ( 0.00, -0.040, -0.035),   # 3  inf-R
        # Mitad del pico
        ( 0.14,  0.030,  0.008),   # 4  mid sup-L
        ( 0.14, -0.030,  0.008),   # 5  mid sup-R
        ( 0.14,  0.022, -0.040),   # 6  mid inf-L
        ( 0.14, -0.022, -0.040),   # 7  mid inf-R
        # Punta con ligero gancho hacia abajo
        ( 0.26,  0.010, -0.010),   # 8  punta-L
        ( 0.26, -0.010, -0.010),   # 9  punta-R
        ( 0.26,  0.008, -0.055),   # 10 gancho-L
        ( 0.26, -0.008, -0.055),   # 11 gancho-R
    ]
    verts = [bm.verts.new(v) for v in vdata]
    bm.verts.ensure_lookup_table()
    v = verts

    # Caras del pico
    faces = [
        # Panel superior (0-1-5-4)
        [v[0], v[1], v[5], v[4]],
        [v[4], v[5], v[9], v[8]],
        # Panel inferior (2-3-7-6)
        [v[2], v[3], v[7], v[6]],
        [v[6], v[7], v[11], v[10]],
        # Lados izquierdo
        [v[0], v[2], v[6], v[4]],
        [v[4], v[6], v[10], v[8]],
        # Lados derecho
        [v[1], v[3], v[7], v[5]],
        [v[5], v[7], v[11], v[9]],
        # Base trasera
        [v[0], v[1], v[3], v[2]],
        # Punta
        [v[8], v[9], v[11], v[10]],
    ]
    for f in faces:
        try:
            bm.faces.new(f)
        except Exception:
            pass

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("BeakMesh")
    bm.to_mesh(mesh)
    bm.free()

    o = bpy.data.objects.new("Beak", mesh)
    o.location = (0.44, 0, 0.30)   # posicionado en la cara de la cabeza
    bpy.context.collection.objects.link(o)
    assign(o, M["orange"])
    return o

def make_eyes(M):
    eyes = []
    for side, y in [('L', 0.11), ('R', -0.11)]:
        # Globo ocular blanco
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=10, ring_count=8, radius=0.048,
            location=(0.38, y, 0.40))
        white = bpy.context.active_object
        white.name = f"EyeWhite.{side}"
        assign(white, M["eyewhite"])

        # Pupila negra (encima)
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=8, ring_count=6, radius=0.028,
            location=(0.41, y, 0.40))
        pupil = bpy.context.active_object
        pupil.name = f"EyePupil.{side}"
        assign(pupil, M["black"])

        eyes.extend([white, pupil])
    return eyes

def make_wings(M):
    wings = []
    for side, sign in [('L', 1.0), ('R', -1.0)]:
        bm = bmesh.new()

        # Ala en reposo colgando ligeramente hacia abajo
        # Raíz cerca del lomo, punta apuntando hacia afuera y atrás
        vdata = [
            # Raíz
            ( 0.06, sign*0.10,  0.10),   # 0 raíz-sup-frente
            (-0.02, sign*0.10, -0.04),   # 1 raíz-inf-frente
            ( 0.06, sign*0.10, -0.10),   # 2 raíz-trasera
            # Parte media
            (-0.04, sign*0.28,  0.04),   # 3 mid-frente
            (-0.06, sign*0.30, -0.06),   # 4 mid-media
            (-0.04, sign*0.26, -0.14),   # 5 mid-trasera
            # Punta (primarias)
            (-0.18, sign*0.46,  0.00),   # 6 tip-frente
            (-0.20, sign*0.48, -0.08),   # 7 tip-media
            (-0.16, sign*0.42, -0.18),   # 8 tip-trasera
        ]
        verts = [bm.verts.new(v) for v in vdata]
        bm.verts.ensure_lookup_table()
        v = verts

        faces = [
            [v[0], v[1], v[4], v[3]],
            [v[1], v[2], v[5], v[4]],
            [v[3], v[4], v[7], v[6]],
            [v[4], v[5], v[8], v[7]],
        ]
        for f in faces:
            bm.faces.new(f)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

        mesh = bpy.data.meshes.new(f"WingMesh.{side}")
        bm.to_mesh(mesh)
        bm.free()

        o = bpy.data.objects.new(f"Wing.{side}", mesh)
        o.location = (0, 0, 0)
        bpy.context.collection.objects.link(o)
        assign(o, M["lgray"])
        wings.append(o)
    return wings

def make_tail(M):
    bm = bmesh.new()
    vdata = [
        (-0.20,  0.13,  0.04),  # raíz-L
        (-0.20, -0.13,  0.04),  # raíz-R
        (-0.20,  0.00,  0.12),  # raíz-top
        (-0.44,  0.20, -0.02),  # tip-L
        (-0.44, -0.20, -0.02),  # tip-R
        (-0.44,  0.00,  0.06),  # tip-top
    ]
    verts = [bm.verts.new(v) for v in vdata]
    bm.verts.ensure_lookup_table()
    v = verts
    for f in [[v[0],v[1],v[4],v[3]], [v[0],v[2],v[5],v[3]], [v[1],v[2],v[5],v[4]]]:
        bm.faces.new(f)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("TailMesh")
    bm.to_mesh(mesh)
    bm.free()
    o = bpy.data.objects.new("Tail", mesh)
    o.location = (0, 0, 0)
    bpy.context.collection.objects.link(o)
    assign(o, M["white"])
    return o

def make_legs(M):
    objs = []
    for side, y in [('L', 0.07), ('R', -0.07)]:
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=6, radius=0.020, depth=0.14,
            location=(0.00, y, -0.36))
        leg = bpy.context.active_object
        leg.name = f"Leg.{side}"
        assign(leg, M["orange"])

        bpy.ops.mesh.primitive_cylinder_add(
            vertices=6, radius=0.060, depth=0.015,
            location=(0.04, y, -0.435))
        foot = bpy.context.active_object
        foot.name = f"Foot.{side}"
        foot.scale.x = 1.8
        bpy.ops.object.transform_apply(scale=True)
        assign(foot, M["orange"])
        objs.extend([leg, foot])
    return objs


# ──────────────────────────────────────────────────────────────────
# ARMATURE
# ──────────────────────────────────────────────────────────────────

def build_rig():
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    rig = bpy.context.active_object
    rig.name = "Seagull_Rig"
    rig.data.name  = "Seagull_Armature"
    rig.data.display_type = 'STICK'
    rig.show_in_front = True

    bpy.ops.armature.select_all(action='SELECT')
    bpy.ops.armature.delete()

    eb = rig.data.edit_bones

    def bone(name, head, tail, parent=None, conn=False):
        b = eb.new(name)
        b.head = Vector(head)
        b.tail = Vector(tail)
        if parent:
            b.parent = eb[parent]
            b.use_connect = conn
        return b

    #          head xyz              tail xyz
    bone("Root",      ( 0.00, 0.00,-0.50), ( 0.00, 0.00,-0.10))
    bone("Body",      ( 0.00, 0.00,-0.10), ( 0.00, 0.00, 0.20), "Root")
    bone("Neck",      ( 0.14, 0.00, 0.22), ( 0.20, 0.00, 0.34), "Body")
    bone("Head",      ( 0.20, 0.00, 0.34), ( 0.26, 0.00, 0.54), "Neck")
    bone("Beak",      ( 0.44, 0.00, 0.30), ( 0.68, 0.00, 0.26), "Head")
    bone("Wing.L",    ( 0.02, 0.10, 0.08), (-0.12, 0.30, 0.02), "Body")
    bone("WingTip.L", (-0.12, 0.30, 0.02), (-0.22, 0.50,-0.04), "Wing.L", True)
    bone("Wing.R",    ( 0.02,-0.10, 0.08), (-0.12,-0.30, 0.02), "Body")
    bone("WingTip.R", (-0.12,-0.30, 0.02), (-0.22,-0.50,-0.04), "Wing.R", True)
    bone("Tail",      (-0.18, 0.00, 0.04), (-0.40, 0.00,-0.02), "Body")

    bpy.ops.object.mode_set(mode='OBJECT')
    return rig


# ──────────────────────────────────────────────────────────────────
# SKINNING
# ──────────────────────────────────────────────────────────────────

def skin(rig, meshes):
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes:
        o.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    print("  ✔ Skinning aplicado")


# ──────────────────────────────────────────────────────────────────
# ANIMACIÓN — helpers
# ──────────────────────────────────────────────────────────────────

ALL_BONES = ["Root","Body","Neck","Head","Beak",
             "Wing.L","WingTip.L","Wing.R","WingTip.R","Tail"]

def new_action(rig, name):
    act = bpy.data.actions.new(name)
    rig.animation_data_create()
    rig.animation_data.action = act
    return act

def reset_pose(rig):
    for name in ALL_BONES:
        pb = rig.pose.bones.get(name)
        if not pb:
            continue
        pb.rotation_mode = 'XYZ'
        pb.rotation_euler = (0, 0, 0)
        pb.location       = (0, 0, 0)

def rot(rig, bone, frame, xyz_deg):
    """Keyframe rotación en grados XYZ"""
    pb = rig.pose.bones.get(bone)
    if not pb:
        return
    pb.rotation_mode = 'XYZ'
    pb.rotation_euler = [R(a) for a in xyz_deg]
    pb.keyframe_insert("rotation_euler", frame=frame)

def loc(rig, bone, frame, xyz):
    """Keyframe ubicación (pose-space)"""
    pb = rig.pose.bones.get(bone)
    if not pb:
        return
    pb.location = Vector(xyz)
    pb.keyframe_insert("location", frame=frame)

def make_fcurves_smooth(action):
    """Interpolación BEZIER en todas las fcurves (movimientos suaves)"""
    for fc in action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = 'BEZIER'


# ──────────────────────────────────────────────────────────────────
# 6 ANIMACIONES
# ──────────────────────────────────────────────────────────────────

def anim_idle(rig):
    """Idle 60f — flotación suave, respiración, cola mecea"""
    act = new_action(rig, "Idle")
    reset_pose(rig)

    # Cuerpo sube y baja (respiración)
    for f, z in [(0,0),(12,0.012),(24,0),(36,-0.008),(48,0),(60,0)]:
        loc(rig, "Body", f, (0,0,z))

    # Cabeza: giro lento mirando alrededor
    for f, rz in [(0,0),(20,6),(40,0),(60,0)]:
        rot(rig, "Head", f, (0,0,rz))

    # Alas en reposo: leve sway
    for f, rx in [(0,0),(20,4),(40,-2),(60,0)]:
        rot(rig, "Wing.L", f, (rx, 0,-8))
        rot(rig, "Wing.R", f, (rx, 0, 8))

    # Cola: mecea suave
    for f, ry in [(0,0),(15,4),(30,0),(45,-4),(60,0)]:
        rot(rig, "Tail", f, (0,ry,0))

    act.frame_range = (0, 60)
    make_fcurves_smooth(act)
    print("  ✔ Idle (60f)")
    return act


def anim_greet(rig):
    """
    Greet 50f — SALUDO
    - Ala izquierda sube y agita 3 veces (hola!)
    - Cabeza asiente 2 veces
    - Cuerpo se inclina un poco hacia adelante
    """
    act = new_action(rig, "Greet")
    reset_pose(rig)

    # Cuerpo se inclina hacia adelante (entusiasmo)
    for f, rx in [(0,0),(8,-8),(50,0)]:
        rot(rig, "Body", f, (rx,0,0))

    # Cabeza: asiente 2 veces (sí, sí)
    for f, rx in [(0,0),(8,-14),(14,8),(22,-12),(28,6),(50,0)]:
        rot(rig, "Head", f, (rx,0,0))

    # Ala izquierda: SUBE y agita 3 veces
    for f, rx, rz in [
        ( 0,  0,  -8),
        ( 8, 60,  20),   # sube
        (16, 45,  10),   # agita 1
        (22, 60,  20),
        (28, 45,  10),   # agita 2
        (34, 60,  20),
        (40, 45,  10),   # agita 3
        (50,  0,  -8),   # baja
    ]:
        rot(rig, "Wing.L", f, (rx,0,rz))

    # Punta de ala izquierda sigue con retraso
    for f, rx in [(0,0),(10,25),(18,15),(26,25),(34,15),(42,25),(50,0)]:
        rot(rig, "WingTip.L", f, (rx,0,0))

    # Ala derecha: quieta en reposo
    rot(rig, "Wing.R",    0, (0,0,8))
    rot(rig, "Wing.R",   50, (0,0,8))

    act.frame_range = (0, 50)
    make_fcurves_smooth(act)
    print("  ✔ Greet (50f)")
    return act


def anim_alert(rig):
    """
    Alert 35f — ALERTA
    - Cabeza se dispara hacia arriba de golpe
    - Cuerpo se endereza rápido
    - Alas se abren un poco (susto)
    - Queda en posición alerta
    """
    act = new_action(rig, "Alert")
    reset_pose(rig)

    # Cuerpo: de relajado a completamente erguido, rápido
    for f, rx, z in [(0,0,0),(4,-12,0.018),(12,0,0.008),(35,0,0.005)]:
        rot(rig, "Body",  f, (rx,0,0))
        loc(rig, "Body",  f, (0,0,z))

    # Cabeza: snap hacia arriba (sorpresa)
    for f, rx, rz in [
        ( 0,  0, 0),
        ( 3,-25, 0),   # cabeza dispara arriba
        ( 8,-15, 4),   # mira alrededor
        (14,-18,-4),
        (20,-16, 2),
        (35,-14, 0),   # queda alerta mirando al frente
    ]:
        rot(rig, "Head", f, (rx,0,rz))

    # Cuello se estira
    for f, rx in [(0,0),(3,-10),(35,-6)]:
        rot(rig, "Neck", f, (rx,0,0))

    # Alas: se abren un poco (reacción de susto)
    for f, rx in [(0,0),(4,18),(10,12),(35,10)]:
        rot(rig, "Wing.L", f, (rx, 0,-8))
        rot(rig, "Wing.R", f, (rx, 0, 8))

    # Cola: se levanta (tensión)
    for f, rx in [(0,0),(4,-15),(35,-10)]:
        rot(rig, "Tail", f, (rx,0,0))

    act.frame_range = (0, 35)
    make_fcurves_smooth(act)
    print("  ✔ Alert (35f)")
    return act


def anim_talk(rig):
    """
    Talk 60f — HABLAR
    - Pico abre y cierra 5 veces
    - Cabeza hace gestos expresivos
    - Cuerpo acompaña el habla
    """
    act = new_action(rig, "Talk")
    reset_pose(rig)

    # Pico abre/cierra x5 (hablar)
    beak_kf = [
        (0,0),(5,-22),(9,0),(13,-18),(17,0),
        (21,-20),(25,0),(30,-16),(34,0),(40,-20),(44,0),(60,0)
    ]
    for f, rx in beak_kf:
        rot(rig, "Beak", f, (rx,0,0))

    # Cabeza: gesticula mientras habla
    for f, rx, rz in [
        ( 0,  0,  0),
        ( 6, -8,  6),
        (12,  4, -4),
        (18, -6,  8),
        (26,  5, -6),
        (34, -7,  5),
        (42,  3, -3),
        (60,  0,  0),
    ]:
        rot(rig, "Head", f, (rx,0,rz))

    # Cuerpo: leve movimiento de énfasis
    for f, rx, z in [
        (0, 0, 0),(10,-4,0.008),(20,2,0),(30,-3,0.006),(45,1,0),(60,0,0)
    ]:
        rot(rig, "Body", f, (rx,0,0))
        loc(rig, "Body", f, (0,0,z))

    # Alas: pequeños gestos (como cuando hablas con las manos)
    for f, rx in [(0,0),(15,8),(30,4),(45,10),(60,0)]:
        rot(rig, "Wing.L", f, (rx,0,-8))
        rot(rig, "Wing.R", f, (rx,0, 8))

    act.frame_range = (0, 60)
    make_fcurves_smooth(act)
    print("  ✔ Talk (60f)")
    return act


def anim_worry(rig):
    """
    Worry 70f — PREOCUPACIÓN
    - Cabeza baja, encogida
    - Cuerpo se hunde y tiembla levemente
    - Alas caídas
    - Cabeza mira de un lado al otro nerviosamente
    """
    act = new_action(rig, "Worry")
    reset_pose(rig)

    # Cuerpo: se encoge hacia abajo
    for f, z, rx in [
        ( 0, 0.00, 0),
        ( 8,-0.020, 6),   # se hunde
        (14,-0.025, 8),
        # tiemblo (frames cercanos, amplitud pequeña)
        (20,-0.022, 7),(22,-0.028, 8),(24,-0.023, 7),(26,-0.027, 8),
        (30,-0.024, 7),(32,-0.029, 8),(34,-0.022, 7),(36,-0.028, 8),
        (70,-0.020, 6),
    ]:
        loc(rig, "Body", f, (0,0,z))
        rot(rig, "Body", f, (rx,0,0))

    # Cabeza: baja y mira nerviosamente de lado a lado
    for f, rx, rz in [
        ( 0,  0,  0),
        (10, 18, 0),    # cabeza baja (mira el suelo)
        (18, 16, 12),   # mira a la izquierda
        (26, 18,-12),   # mira a la derecha
        (34, 16, 10),
        (42, 18,-10),
        (52, 16,  8),
        (62, 18, -8),
        (70, 16,  0),   # queda cabizbaja
    ]:
        rot(rig, "Head", f, (rx,0,rz))

    # Cuello: encogido
    for f, rx in [(0,0),(10,10),(70,8)]:
        rot(rig, "Neck", f, (rx,0,0))

    # Alas: caídas y ligeramente abiertas (ansiedad)
    for f, rx in [(0,0),(8,-10),(20,-12),(70,-10)]:
        rot(rig, "Wing.L", f, (rx,0,-5))
        rot(rig, "Wing.R", f, (rx,0, 5))

    # Cola: baja (ánimo caído)
    for f, rx in [(0,0),(8,12),(70,10)]:
        rot(rig, "Tail", f, (rx,0,0))

    act.frame_range = (0, 70)
    make_fcurves_smooth(act)
    print("  ✔ Worry (70f)")
    return act


def anim_celebrate(rig):
    """
    Celebrate 55f — CELEBRACIÓN
    - Salta (cuerpo sube y baja x2)
    - Alas se abren completamente en cada salto
    - Cabeza echa hacia atrás (¡yuhu!)
    - Cola levantada, festiva
    """
    act = new_action(rig, "Celebrate")
    reset_pose(rig)

    # Cuerpo: 2 saltos
    jumps = [
        (0,  0.00),(4, -0.015),(8,  0.045),(13, 0.00),  # salto 1
        (17,-0.010),(22, 0.055),(27, 0.00),              # salto 2
        (55, 0.00),
    ]
    for f, z in jumps:
        loc(rig, "Body", f, (0,0,z))

    # Cuerpo rotation: se inclina hacia atrás al saltar
    for f, rx in [(0,0),(8,-18),(13,4),(22,-20),(27,3),(55,0)]:
        rot(rig, "Body", f, (rx,0,0))

    # Cabeza: ¡ARRIBA! (¡YUHU!)
    for f, rx in [(0,0),(6,-28),(12,-22),(20,-32),(26,-20),(55,-15)]:
        rot(rig, "Head", f, (rx,0,0))

    # Alas: se abren al máximo en cada salto → glorioso
    for f, rx in [
        (0,  0),(6,  70),(12,  0),   # salto 1: abren totalmente
        (18, 0),(22,  75),(28,  0),  # salto 2: abren más
        (55, 0),
    ]:
        rot(rig, "Wing.L", f, (rx,0, 15))
        rot(rig, "Wing.R", f, (rx,0,-15))

    # Puntas de ala: siguen con retraso dramático
    for f, rx in [
        (0,0),(8,40),(14,0),(20,0),(25,50),(31,0),(55,0)
    ]:
        rot(rig, "WingTip.L", f, (rx,0,0))
        rot(rig, "WingTip.R", f, (rx,0,0))

    # Cola: arriba! (festiva)
    for f, rx in [(0,0),(6,-22),(13,-5),(20,-25),(27,-5),(55,-15)]:
        rot(rig, "Tail", f, (rx,0,0))

    # Pico: se abre (¡YAAAY!)
    for f, rx in [(0,0),(5,-20),(10,0),(18,-25),(24,0),(55,0)]:
        rot(rig, "Beak", f, (rx,0,0))

    act.frame_range = (0, 55)
    make_fcurves_smooth(act)
    print("  ✔ Celebrate (55f)")
    return act


# ──────────────────────────────────────────────────────────────────
# NLA — actions → tracks independientes en el GLB
# ──────────────────────────────────────────────────────────────────

def push_nla(rig, actions):
    ad = rig.animation_data
    ad.action = None

    for act in actions:
        track = ad.nla_tracks.new()
        track.name = act.name
        strip = track.strips.new(act.name, int(act.frame_range[0]), act)
        strip.action = act
        strip.action_frame_start = act.frame_range[0]
        strip.action_frame_end   = act.frame_range[1]
        # Guard para atributos que varían por versión
        for attr, val in [("use_cyclic", True), ("repeat", 1.0)]:
            if hasattr(strip, attr):
                setattr(strip, attr, val)

    print(f"  ✔ NLA: {[a.name for a in actions]}")


# ──────────────────────────────────────────────────────────────────
# EXPORT
# ──────────────────────────────────────────────────────────────────

def export_glb(path):
    bpy.ops.object.select_all(action='SELECT')
    base_kwargs = dict(
        filepath=path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_animations=True,
        export_nla_strips=True,
        export_force_sampling=True,
        export_skins=True,
    )
    # export_morph varía por versión — intento con y sin él
    try:
        bpy.ops.export_scene.gltf(**base_kwargs, export_morph=False)
    except TypeError:
        try:
            bpy.ops.export_scene.gltf(**base_kwargs)
        except Exception as e:
            print(f"  ⚠ Export falló: {e}")
            print("  → Exporta manualmente: File > Export > glTF 2.0")
            return
    print(f"  ✔ GLB → {path}")


# ──────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────

def main():
    print("\n" + "═"*52)
    print("  🦅  SpaceHack — Seagull Generator v3")
    print("═"*52)

    clear_scene()

    # Materiales
    M = {
        "white":    mat("White",    (0.95,0.95,0.94)),
        "lgray":    mat("LGray",    (0.68,0.70,0.72)),
        "dgray":    mat("DGray",    (0.28,0.30,0.33)),
        "orange":   mat("Orange",   (0.90,0.44,0.04), rough=0.42),
        "black":    mat("Black",    (0.02,0.02,0.02), rough=0.9),
        "eyewhite": mat("EyeWhite", (1.00,1.00,1.00), rough=0.2),
    }

    # Geometría
    print("\n[1/4] Geometría...")
    all_meshes = []
    all_meshes.append(make_body(M))
    all_meshes.append(make_head(M))
    all_meshes.append(make_beak(M))
    all_meshes.extend(make_eyes(M))
    all_meshes.extend(make_wings(M))
    all_meshes.append(make_tail(M))
    all_meshes.extend(make_legs(M))
    print(f"  ✔ {len(all_meshes)} objetos")

    # Rig
    print("\n[2/4] Armadura...")
    rig = build_rig()
    print("  ✔ 10 huesos")

    # Skinning
    print("\n[3/4] Skinning...")
    skin(rig, all_meshes)

    # Animaciones
    print("\n[4/4] Animaciones...")
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')

    acts = [
        anim_idle(rig),
        anim_greet(rig),
        anim_alert(rig),
        anim_talk(rig),
        anim_worry(rig),
        anim_celebrate(rig),
    ]

    bpy.ops.object.mode_set(mode='OBJECT')
    push_nla(rig, acts)

    # Export
    if AUTO_EXPORT:
        if OUTPUT_PATH.startswith("//") and not bpy.data.filepath:
            print("\n⚠  Guarda el .blend primero (Ctrl+S) o usa ruta absoluta:")
            print('   OUTPUT_PATH = "C:/Users/ASUS/Desktop/seagull.glb"')
        else:
            export_glb(OUTPUT_PATH)

    # Resumen
    print("\n" + "═"*52)
    print("  ✅  ¡Gaviota lista!")
    print()
    print("  ANIMACIONES para tu componente:")
    print("    Idle      → reposo (modelPath cargado)")
    print("    Greet     → animationAction='Greet'")
    print("    Alert     → animationAction='Alert'")
    print("    Talk      → animationAction='Talk'")
    print("    Worry     → animationAction='Worry'")
    print("    Celebrate → animationAction='Celebrate'")
    print()
    print("  PRÓXIMOS PASOS:")
    print("  1. Copia seagull.glb → public/models/seagull.glb")
    print("  2. En src/routes/index.tsx:")
    print('       modelPath="/models/seagull.glb"')
    print("  3. Console del browser debe mostrar:")
    print('       📦 Animaciones detectadas:')
    print('       ["Idle","Greet","Alert","Talk","Worry","Celebrate"]')
    print()
    print("  PARA ITERAR:")
    print("  • Manda screenshot → ajusto proporciones")
    print("  • Manda traceback  → arreglo el error")
    print("═"*52 + "\n")


main()
