"""Clip the public-domain Natural Earth 1:10m land rings, no runtime network."""
import json, sys
MINX, MAXX, MINY, MAXY = -122.62, -122.30, 37.70, 37.97

def clip(poly, axis, value, keep_greater):
    result = []
    if not poly: return result
    a = poly[-1]
    ai = a[axis] >= value if keep_greater else a[axis] <= value
    for b in poly:
        bi = b[axis] >= value if keep_greater else b[axis] <= value
        if ai != bi:
            t = (value-a[axis])/(b[axis]-a[axis])
            result.append([a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t])
        if bi: result.append(b)
        a, ai = b, bi
    return result
source = json.load(open(sys.argv[1]))
rings = []
for feature in source['features']:
    geometry = feature['geometry']
    polys = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    for poly in polys:
        outer = poly[0]
        if max(p[0] for p in outer)<MINX or min(p[0] for p in outer)>MAXX or max(p[1] for p in outer)<MINY or min(p[1] for p in outer)>MAXY: continue
        for axis, val, greater in [(0,MINX,True),(0,MAXX,False),(1,MINY,True),(1,MAXY,False)]: outer=clip(outer,axis,val,greater)
        if len(outer)>3: rings.append([[round(x,6),round(y,6)] for x,y in outer])
json.dump({'source':'Natural Earth 1:10m land; public domain','bbox':[MINX,MINY,MAXX,MAXY],'rings':rings}, open('public/assets/coastline.json','w'),separators=(',',':'))
print('Clipped rings:',len(rings),'vertices:',sum(len(p) for p in rings))
for ring in rings: print(len(ring), ring[:3])
