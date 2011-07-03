# Othello
# by tieg
# 1/13/08
# with help: DeeJay, Ryan M. from mailing list
#
# FIXME bug if it memorizes it but it's not a valid move
#
#require 'dynaload'
#require 'worlds/sim1'


module AgentFrontEnd
  class AgentGUI

    attr_accessor :source, :board, :paused, :world

    def initialize(source)
      @paused = false
      @source = source
      load_world
      @board = new_board
    end

    def load_world
      begin
        world_script = eval(File.read(@source))
        @world = SimWorld.build_world
      rescue => e
        alert(e)
      end
    end

    def pause!
      @paused = !@paused
    end

    def reset!(width = nil, height = nil)
      @paused = true
	  @world = SimWorld.build_world(width, height)
      @board = new_board
#	  draw_board
#      @paused = false
    end

    def reload!
      @paused = true
      load_world
    end

    # Build the array for the board, with zero-based arrays.
    def new_board
      Array.new(@world.grid.size) do # build each cols L to R
        Array.new(@world.grid[0].size) do # insert cells in each col
          0
        end
      end
    end

  end


  # Display logic
  
  @this_game = nil


  def draw_dirty_patches
    @dirty_patches_frame = stack :left => 0, :top => 0, :margin => 10 do
      @this_game.world.dirty_patches.each do |patch|
        left, top = left_top_corner_of_piece(patch.y, patch.x)
        left = left - @left_offset
        top = top - @top_offset

        fill send(patch.terrain.color, 200 + patch.terrain.current_yield)
        rect :left => left, :top => top, :width => @piece_width, :height => @piece_height

        if @show_detail > 4
          para("#{patch.terrain.color}", :left => left + @piece_width / 2, :top => top + @piece_height / 2, :stroke => black, :font => "Trebuchet 10px bold")
        end
      end
    end 
  end

  def draw_agents
    @world_frame2 = stack :left => 0, :top => 0, :margin => 10 do
      strokewidth 0
	  ac = {}
      @this_game.world.live_agents.each do |agent|
        left, top = left_top_corner_of_piece(agent.position.x, agent.position.y)
		key = agent.position.x * @this_game.world.grid.length + agent.position.y
		count = ac[key]
		count ||= 0
		count = count + 1 if agent.health > 0
		ac[key] = count
        left = left - @left_offset
        top = top - @top_offset
        aw = @piece_width-10
        aw = 4 if aw < 4
        ah = @piece_height-10
        ah = 4 if ah < 4
        strength = agent.health >= 100 ? 255 : 155 + agent.health
        fill send(agent.identifying_culture.colour, strength)
        oval(left+5, top+5, aw, ah)
        if @show_detail > 4
            para("#{agent.position.x}", :left => left + 5, :top => top + 5, :stroke => black, :font => "Trebuchet 10px bold") #if agent.partner
        end
      end
	  if @show_detail > 4
		@this_game.board.each_with_index do |row, row_index|
   		  row.each_with_index do |cell, col_index|
			 patch = @this_game.world.grid[row_index][col_index]
			 count = ac[row_index * @this_game.world.grid.length + col_index]
			 left, top = left_top_corner_of_piece(row_index, col_index)
			 left = left - @left_offset
			 top = top - @top_offset

			 para("#{count}", :left => left + 5, :top => top + 5, :stroke => black, :font => "Trebuchet 10px bold")
		  end
		end
  	  end
	 
    end
  end


  def draw_display
    if @dirty_patches_frame
      @dirty_patches_frame.remove
      @dirty_patches_frame = nil
    end
    if @world_frame2
      @world_frame2.remove
      @world_frame2 = nil
    end
    if @stats_frame
      @stats_frame.remove
      @stats_frame = nil
    end
    draw_grid if @show_detail > 2
#    draw_dirty_patches
    draw_agents
    draw_stats # if @this_game.world.current_iteration % 20 == 0
  end


  def draw_stats
    @stats_frame = stack :top => 0, :left => 861, :margin => 10, :width => 360, :height => 280 do
      background "#fff", :curve => 12
      border "#00D0FF", :strokewidth => 3, :curve => 12
      stack :margin => 20 do
        t = 20
        @running_time = Time.now - @start_time
        flow :top => t do
          para "Time elapsed: ", :left => 20 
          para "#{@running_time}", :left => 180
        end
        t = t + 20
        flow :top => t do
          para "Iterations:", :left => 20
          para "#{@this_game.world.current_iteration}", :left => 180
        end
        t = t + 20
        flow :top => t do
          para "Total agents:", :left => 20
          para "#{@this_game.world.agents.size}", :left => 180
        end
        t = t + 20
        flow :top => t do
          para "Current agents:", :left => 20
          para "#{@this_game.world.live_agents.size}", :left => 180
        end
        @this_game.world.cultures.each do |team|
          t = t + 20
          flow :top => t do
            para "#{team.name}:", :left => 20, :stroke => send(team.colour)
            para "#{team.agents.size}", :left => 180, :stroke => send(team.colour)
          end
          t = t + 20
          flow :top => t do
            para "Fertility rate:", :left => 20, :stroke => send(team.colour)
            para "#{team.fertility_rate_mean}", :left => 180, :stroke => send(team.colour)
          end
          t = t + 20
          flow :top => t do
            para "Memory size:", :left => 20, :stroke => send(team.colour)
            para "#{team.agents[0].memories.size}", :left => 180, :stroke => send(team.colour)
          end if team.agents.size > 0
        end
      end
    end
  end

  def draw_setup
    if @setup
      @setup.remove
      @setup = nil
    end
    @setup = stack :top => 300, :left => 861, :margin => 10, :width => 360 do
      background "#fff", :curve => 12
      border "#00D0FF", :strokewidth => 3, :curve => 12
      stack :margin => 20 do
        flow :margin => 0 do
          @play_button = button("Play | Pause", :top => 0, :margin => 2, :left => 0, :width => 80 ) {
			do_animate
          }
          @reset_button = button("Reset", :top => 0, :margin => 2, :left => 90, :width => 80 ) {
            do_reset
           }
          @reload_button = button("Reload", :top => 0, :margin => 2, :left => 180, :width => 80 ) {
			@this_game.paused = true
			@animation.stop
            @this_game.reload!
            init_params
            draw_grid
            draw_display
			@animation.stop if @animation
			@animation = nil
#            draw_setup
          }
        end
        t = 40
        flow :top => t, :left => 0 do
          para "Show detail?  ", :stroke => black
          @show_detail_list = list_box :items => ["1", "2", "3", "4", "5"],
           :left => 160, :width => 120, :choose => @show_detail.to_s do |list|
           @show_detail = list.text

          end
        end
        t = 80
       flow :top => t, :left => 0 do
         para "Iteration speed:  ", :stroke => black
         @iteration_speed_list = list_box :items => (1..10).collect{|i|i.to_s},
          :left => 160, :width => 120, :choose => @iteration_speed.to_s do |list|
           @iteration_speed = list.text.to_i
         end
       end
       t = 120
        flow :top => t, :left => 0 do
          para "No. of cells:  ", :stroke => black
		  edit_line :text => @grid_size, :left => 160, :width => 50 do |e|
              @grid_size = e.text().to_i
		  end
        end
       t = 160
        @culture_names ||= []
        @this_game.world.cultures.each_with_index do |team, i|
          flow :top => t, :left => 0 do
            @culture_names << para(span("#{team.name}: ", :stroke => black))
            edit_line :text => team.base_size, :left => 160, :width => 40 do |e|
              @culture_sizes ||= {}
              @culture_sizes[team.name] = e.text().to_i
            end
            @reload_button = button("Configure", :margin => 2, :left => 220, :width => 80 ) {
              @this_game.paused = true
              open_config(self, i)
            }
          end
          t += 40
        end
      end
    end
  end

  def do_reset
    @this_game.paused = true
    @this_game.reset!(@grid_size, @grid_size)
    @this_game.world.cultures.each do |culture|
      culture.base_size = @culture_sizes[culture.name] if @culture_sizes[culture.name]
    end
    @this_game.world.reset
    @this_game.world.finalise
    @start_time = Time.now
    @show_detail = @show_detail_list.text.to_i

    reset_params
    draw_grid
    draw_display
    @animation.stop if @animation
    @animation = nil
  end
  
  def do_animate
    setup_animation unless @animation
	@this_game.pause!
	if @this_game.paused
	  @running_time = Time.now - @start_time
	  @animation.stop
	else
	  @start_time = Time.now - @running_time
	  @animation.start
	end
  end

  def setup_animation
	@animation = animate @iteration_speed do
		unless @this_game.world.live_agents.size <= 0
		  @this_game.world.iterate
		  draw_display 
		end
    end
  end

  def update_culture_name(index, name)
    @culture_names[index].text = span("#{name}: ")
  end

  def open_config(parent_window, index)
    game = @this_game
    team = @this_game.world.cultures[index]
    window :height => 800 do
      stack :margin => 10 do
        para "Configuring #{team.name}"
         flow :left => 0 do
           para "Name:  ", :stroke => black
           @culture_name = edit_line :text => team.name, :left => 160, :width => 160 
         end


         flow :left => 0 do
           para "Culture parameters:  ", :stroke => black
           para "Mean:  ", :left => 170, :stroke => black
           para "Std dev:  ", :left => 250, :stroke => black
         end

         flow :left => 0 do
           para "Childbirth:  ", :stroke => black
           @cbm = edit_line :text => team.childbirth_age_mean, :left => 160, :width => 60
           @cbs = edit_line :text => team.childbirth_age_std_dev, :left => 240, :width => 60
         end

         flow :left => 0 do
           para "Fertility:  ", :stroke => black
           @fm = edit_line :text => team.fertility_rate_mean, :left => 160, :width => 60
           @fs = edit_line :text => team.fertility_rate_std_dev, :left => 240, :width => 60
         end

         flow :left => 0 do
           para "Life expectancy:  ", :stroke => black
           @lem = edit_line :text => team.life_expectancy_mean, :left => 160, :width => 60
           @les = edit_line :text => team.life_expectancy_std_dev, :left => 240, :width => 60
         end

         flow :left => 0 do
           para "Initial health (%):  ", :stroke => black
           @ihm = edit_line :text => team.initial_health_mean, :left => 160, :width => 60
           @ihs = edit_line :text => team.initial_health_std_dev, :left => 240, :width => 60
         end

        flow :left => 0 do
          para "Desires:  ", :stroke => black
        end

        @checks = Array.new(CommonDesires::TYPES_OF_DESIRE.length)
        @intensities = Array.new(CommonDesires::TYPES_OF_DESIRE.length)
        @culture_desire_templates = {}
        team.desires.each{|desire| @culture_desire_templates[desire.template] = desire }
        CommonDesires::TYPES_OF_DESIRE.each_with_index{|d, i|
          flow do
            para d.name
            @checks[i] = check :left => 160
            desire = @culture_desire_templates[d]
            if desire
              @checks[i].checked = true
              @intensities[i] = edit_line(:text => desire.intensity, :left => 200, :width => 60)
            else
              @intensities[i] = edit_line(:text => "", :left => 200, :width => 60)
            end
          end
        }
        flow do
          @ok_button = button("OK", :top => 0, :margin => 2, :width => 80 ) {

            team.name = @culture_name.text
            team.childbirth_age_mean = @cbm.text.to_f
            team.childbirth_age_std_dev = @cbs.text.to_f
            team.fertility_rate_mean = @fm.text.to_f
            team.fertility_rate_std_dev = @fs.text.to_f
            team.life_expectancy_mean = @lem.text.to_f
            team.life_expectancy_std_dev = @les.text.to_f
            team.initial_health_mean = @ihm.text.to_f
            team.initial_health_std_dev = @ihs.text.to_f

            team.desires = []
            team.agents.each {|agent| agent.desires = [] }
            @checks.each_with_index do |c, i|
              if c.checked?
                intensity = @intensities[i].text.to_f
                desire = Desire.new(CommonDesires::TYPES_OF_DESIRE[i], intensity)
                team.desires << desire
                team.agents.each {|agent| agent.desires << desire }
              end
            end

            game.paused = true
            game.world.reset
            game.world.finalise
#            parent_window.start_time = Time.now
            parent_window.draw_grid
            parent_window.draw_display
            parent_window.update_culture_name(index, team.name)
            close
          }
          @cancel_button = button("Cancel", :top => 0, :margin => 2, :left => 100, :width => 80 ) {
            close
          }
        end      
      end
    end
  end

  def draw_grid
    if @world_frame
      @world_frame.remove
      @world_frame = nil
    end
    @world_frame = stack :left => 0, :top => 0, :margin => 10 do
      fill white
      strokewidth 1
      rect :left => 0, :top => 0, :width => 841, :height => 841
      stroke rgb(0, 100, 0)


      if @show_detail > 1
        strokewidth 0
        @this_game.board.each_with_index do |col, col_index|
          col.each_with_index do |cell, row_index|
            patch = @this_game.world.grid[col_index][row_index]
            left, top = left_top_corner_of_piece(col_index, row_index)
            left = left - @left_offset
            top = top - @top_offset

			plenitude = (patch.terrain.actual_sustenance_mean > 0 and patch.terrain.current_yield < patch.terrain.actual_sustenance_mean) ? (patch.terrain.current_yield / patch.terrain.actual_sustenance_mean.to_f) : 1.0
			color_factor = (55 + plenitude * 100).to_i
            fill send(patch.terrain.color, color_factor)
            rect :left => left, :top => top, :width => @piece_width, :height => @piece_height

            if @show_detail > 3
				para("#{patch.terrain.current_yield}", :left => left + @piece_width / 2, :top => top + @piece_height / 2, :stroke => black, :font => "Trebuchet 10px bold")
            end
          end
        end
      end

      strokewidth 1
      @this_game.board.each_with_index do |col, col_index|
        line @piece_width * col_index, 0, @piece_width * col_index, 841
      end
      @this_game.board[0].each_with_index do |row, row_index|
        line 0, @piece_height * row_index, 841, @piece_height * row_index
      end
    end
  end

  def draw_board
    clear do
      background "#C7EAFB"
      draw_grid
      draw_setup
      draw_display
    end
  end



  def left_top_corner_of_piece(a,b)
    [(a*@piece_width+@left_offset), (b*@piece_height+@top_offset)]
  end

  def right_bottom_corner_of_piece(a,b)
    left_top_corner_of_piece(a,b).map { |coord| coord + @piece_width }
  end

  def init_params
    @this_game = AgentFrontEnd::AgentGUI.new(ARGV[1])
	  reset_params
  end

  def reset_params
    @cell_array = {}
    @show_detail ||= 2
    @iteration_speed ||= 10
	@grid_size = @this_game.world.grid.length
    @piece_width  = 840 / @this_game.world.grid.length.to_f # 18
    @piece_height = 840 / @this_game.world.grid[0].length.to_f # 18
    @top_offset = 47
    @left_offset = 12
    @start_time = Time.now
    @culture_sizes ||= {}
  end
end


Shoes.app :width => 1400, :height => 900 do
  extend AgentFrontEnd

  init_params

  @this_game.pause!
  draw_board

end

