from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.clientes import router as clientes_router
from app.routers.horarios import router as horarios_router


app = FastAPI(
    title="Sistema de Agendamento API",
    version="1.0.0",
)


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(horarios_router)
app.include_router(clientes_router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}