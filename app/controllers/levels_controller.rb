class LevelsController < ApplicationController
  before_filter :authenticate_user!
  
  # GET /levels
  # GET /levels.xml
  def index
    @levels = Level.all

    respond_to do |format|
      format.html # index.html.erb
      format.js # index.html.erb
      format.xml  { render :xml => @levels }
    end
  end

  # GET /levels/1
  # GET /levels/1.xml
  def show
    @level = Level.find(params[:id])

    respond_to do |format|
      format.html # _show.html.erb
      format.xml  { render :xml => @level }
      format.js
    end
  end

  # GET /levels/new
  # GET /levels/new.xml
  def new
    @level = Level.new
    @level.world_width = 11
    @level.world_height = 11
    @level.initial_agent_number = 1
    @level.wave_number = 10
    @level.expiry_limit = 10
    @level.allow_offscreen_cycling = false
    @level.allow_patches_on_path = false

    respond_to do |format|
      format.html # new.html.erb
      format.js # new.html.erb
      format.xml  { render :xml => @level }
    end
  end

  # GET /levels/1/edit
  def edit
    @level = Level.find(params[:id])
  end

  # GET /levels/1/edit_properties
  def edit_properties
    @level = Level.find(params[:id])
  end

  # POST /levels
  # POST /levels.xml
  def create
    @level = Level.new(params[:level])

    respond_to do |format|
      if @level.save
        format.html { redirect_to(@level, :notice => 'Level was successfully created.') }
        format.xml  { render :xml => @level, :status => :created, :location => @level }
        format.js 
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @level.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /levels/1
  # PUT /levels/1.xml
  def update
    @level = Level.find(params[:id])

    respond_to do |format|
      if @level.update_attributes(params[:level])
        format.html { redirect_to(@level, :notice => 'Level was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @level.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /levels/1
  # DELETE /levels/1.xml
  def destroy
    @level = Level.find(params[:id])
    @level.destroy

    respond_to do |format|
      format.html { redirect_to(levels_url) }
      format.xml  { head :ok }
    end
  end
end
