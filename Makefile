.PHONY: help up down restart logs ps clean up-all down-all restart-all

# Cores para output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Carregar variáveis de ambiente do .env se existir
-include .env
export

help: ## Mostra esta mensagem de ajuda
	@echo "$(CYAN)Comandos disponíveis:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(CYAN)Exemplos de uso com contextos:$(NC)"
	@echo "  make up my_context         - Sobe containers definidos em SELECTED_CONTAINERS_MY_CONTEXT"
	@echo "  make down my_context       - Para containers do contexto my_context"
	@echo "  make restart my_context    - Reinicia containers do contexto my_context"
	@echo "  make logs my_context       - Mostra logs dos containers do contexto my_context"
	@echo ""
	@echo "$(CYAN)Comandos globais:$(NC)"
	@echo "  make up-all                - Sobe todos os containers"
	@echo "  make down-all              - Para todos os containers"
	@echo "  make restart-all           - Reinicia todos os containers"
	@echo "  make ps                    - Lista containers em execução"
	@echo "  make clean                 - Remove containers, volumes e imagens"

up: ## Sobe containers de um contexto específico (uso: make up <context>)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)Erro: Especifique um contexto. Exemplo: make up my_context$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) _up_context CONTEXT=$(filter-out $@,$(MAKECMDGOALS))

down: ## Para containers de um contexto específico (uso: make down <context>)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)Erro: Especifique um contexto. Exemplo: make down my_context$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) _down_context CONTEXT=$(filter-out $@,$(MAKECMDGOALS))

restart: ## Reinicia containers de um contexto específico (uso: make restart <context>)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)Erro: Especifique um contexto. Exemplo: make restart my_context$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) _restart_context CONTEXT=$(filter-out $@,$(MAKECMDGOALS))

logs: ## Mostra logs de um contexto específico (uso: make logs <context>)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)Erro: Especifique um contexto. Exemplo: make logs my_context$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) _logs_context CONTEXT=$(filter-out $@,$(MAKECMDGOALS))

_up_context:
	@CONTEXT_UPPER=$$(echo "$(CONTEXT)" | tr '[:lower:]' '[:upper:]'); \
	VAR_NAME="SELECTED_CONTAINERS_$$CONTEXT_UPPER"; \
	CONTAINERS=$$(eval echo \$$$$VAR_NAME); \
	if [ -z "$$CONTAINERS" ]; then \
		echo "$(RED)Erro: Variável $$VAR_NAME não definida no .env$(NC)"; \
		echo "$(YELLOW)Adicione no .env: $$VAR_NAME=container1,container2$(NC)"; \
		exit 1; \
	fi; \
	echo "$(CYAN)Subindo containers do contexto '$(CONTEXT)': $$CONTAINERS$(NC)"; \
	IFS=','; \
	for container in $$CONTAINERS; do \
		container=$$(echo $$container | xargs); \
		SERVICE=$$(docker-compose ps -a --services | grep -w "$$container" || docker-compose config --services | while read svc; do \
			CONTAINER_NAME=$$(docker-compose ps -q $$svc 2>/dev/null | xargs docker inspect -f '{{.Name}}' 2>/dev/null | sed 's/\///'); \
			if [ "$$CONTAINER_NAME" = "$$container" ]; then echo $$svc; break; fi; \
		done); \
		if [ -z "$$SERVICE" ]; then \
			echo "$(YELLOW)Aviso: Container '$$container' não encontrado no docker-compose.yml$(NC)"; \
		else \
			echo "$(GREEN)Subindo $$SERVICE ($$container)...$(NC)"; \
			docker-compose up -d $$SERVICE; \
		fi; \
	done; \
	echo "$(GREEN)✓ Containers do contexto '$(CONTEXT)' iniciados!$(NC)"

_down_context:
	@CONTEXT_UPPER=$$(echo "$(CONTEXT)" | tr '[:lower:]' '[:upper:]'); \
	VAR_NAME="SELECTED_CONTAINERS_$$CONTEXT_UPPER"; \
	CONTAINERS=$$(eval echo \$$$$VAR_NAME); \
	if [ -z "$$CONTAINERS" ]; then \
		echo "$(RED)Erro: Variável $$VAR_NAME não definida no .env$(NC)"; \
		exit 1; \
	fi; \
	echo "$(CYAN)Parando containers do contexto '$(CONTEXT)': $$CONTAINERS$(NC)"; \
	IFS=','; \
	for container in $$CONTAINERS; do \
		container=$$(echo $$container | xargs); \
		echo "$(YELLOW)Parando $$container...$(NC)"; \
		docker stop $$container 2>/dev/null || echo "$(YELLOW)Container $$container não está rodando$(NC)"; \
	done; \
	echo "$(GREEN)✓ Containers do contexto '$(CONTEXT)' parados!$(NC)"

_restart_context:
	@$(MAKE) _down_context CONTEXT=$(CONTEXT)
	@sleep 2
	@$(MAKE) _up_context CONTEXT=$(CONTEXT)

_logs_context:
	@CONTEXT_UPPER=$$(echo "$(CONTEXT)" | tr '[:lower:]' '[:upper:]'); \
	VAR_NAME="SELECTED_CONTAINERS_$$CONTEXT_UPPER"; \
	CONTAINERS=$$(eval echo \$$$$VAR_NAME); \
	if [ -z "$$CONTAINERS" ]; then \
		echo "$(RED)Erro: Variável $$VAR_NAME não definida no .env$(NC)"; \
		exit 1; \
	fi; \
	echo "$(CYAN)Logs dos containers do contexto '$(CONTEXT)': $$CONTAINERS$(NC)"; \
	IFS=','; \
	CONTAINER_NAMES=""; \
	for container in $$CONTAINERS; do \
		container=$$(echo $$container | xargs); \
		CONTAINER_NAMES="$$CONTAINER_NAMES $$container"; \
	done; \
	docker logs -f $$CONTAINER_NAMES

up-all: ## Sobe todos os containers definidos no docker-compose.yml
	@echo "$(CYAN)Subindo todos os containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Todos os containers iniciados!$(NC)"

down-all: ## Para todos os containers
	@echo "$(CYAN)Parando todos os containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Todos os containers parados!$(NC)"

restart-all: ## Reinicia todos os containers
	@echo "$(CYAN)Reiniciando todos os containers...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✓ Todos os containers reiniciados!$(NC)"

ps: ## Lista os containers em execução
	@docker-compose ps

status: ## Mostra status detalhado dos containers
	@echo "$(CYAN)Status dos containers:$(NC)"
	@docker-compose ps -a

logs-all: ## Mostra logs de todos os containers
	@docker-compose logs -f

clean: ## Remove containers, volumes e redes (CUIDADO: remove dados!)
	@echo "$(RED)⚠️  ATENÇÃO: Isso vai remover todos os containers, volumes e redes!$(NC)"
	@echo "$(YELLOW)Pressione Ctrl+C para cancelar ou Enter para continuar...$(NC)"
	@read confirm
	@docker-compose down -v --remove-orphans
	@echo "$(GREEN)✓ Containers, volumes e redes removidos!$(NC)"

clean-images: ## Remove também as imagens Docker
	@echo "$(RED)⚠️  ATENÇÃO: Isso vai remover containers, volumes, redes E imagens!$(NC)"
	@echo "$(YELLOW)Pressione Ctrl+C para cancelar ou Enter para continuar...$(NC)"
	@read confirm
	@docker-compose down -v --rmi all --remove-orphans
	@echo "$(GREEN)✓ Containers, volumes, redes e imagens removidos!$(NC)"

stop-all: ## Para todos os containers sem removê-los
	@echo "$(CYAN)Parando todos os containers...$(NC)"
	@docker-compose stop
	@echo "$(GREEN)✓ Todos os containers parados!$(NC)"

start-all: ## Inicia todos os containers parados
	@echo "$(CYAN)Iniciando todos os containers...$(NC)"
	@docker-compose start
	@echo "$(GREEN)✓ Todos os containers iniciados!$(NC)"

pull: ## Atualiza todas as imagens Docker
	@echo "$(CYAN)Atualizando imagens Docker...$(NC)"
	@docker-compose pull
	@echo "$(GREEN)✓ Imagens atualizadas!$(NC)"

# Permite passar o contexto como argumento
%:
	@:
